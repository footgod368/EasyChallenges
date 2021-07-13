module NoticeBoard exposing
    ( NoticeBoard, NoticeBoardVisibility(..), NoticeBoardMove(..)
    , init, quickInit
    , update
    , view
    , boundary
    )

{-| The notice board only acts as displaying the text, it only has visibility


# NoticeBoard

@docs NoticeBoard, NoticeBoardVisibility, NoticeBoardMove


# Init

@docs defNoticeBoard, init, quickInit


# Update

@docs update


# View

@docs view

-}

import Array exposing (Array)
import Event
import GlobalBasics
import MainType
import Maybe exposing (withDefault)
import Player
import Svg exposing (Svg, text)
import Svg.Attributes as SvgAttr
import ViewMove
import Brick


{-| Almost same as NoticeBoard's visibility, except adding new words that can be changed. The words are stored in
NoticeBoardVisibility. You can use it like this:

    newNoticeBoardVisibility : NoticeBoardVisibility
    newNoticeBoardVisibility =
        Visible "Hello"
            (VisibleAfterEvent 1
                "Aha, you find how to walk!"
                (InvisibleAfterEvent 2 NoNextNoticeBoardVisibility)
            )

Initially, it will display "Hello", after event id = 1 is activated, it will display "Aha, you find how to walk!",
similarly, after event id = 2 is activated, it will disappear.

-}
type NoticeBoardVisibility
    = Visible String NoticeBoardVisibility
    | Invisible NoticeBoardVisibility
    | VisibleAfterEvent Int String NoticeBoardVisibility
    | InvisibleAfterEvent Int NoticeBoardVisibility
    | NoNextNoticeBoardVisibility


{-| Same as NoticeBoard move.
-}
type NoticeBoardMove
    = Move (Array GlobalBasics.Pos) Float Int NoticeBoardMove
    | NoNextNoticeBoardMove


{-| Definition of noticeBoard, it's information is in String.
-}
type alias NoticeBoard =
    { pos : GlobalBasics.Pos
    , noticeBoardVisibility : NoticeBoardVisibility
    , noticeBoardMove : NoticeBoardMove
    , fontSize : Int
    }


{-| Used in withDefault, no actual use
-}
defNoticeBoard : NoticeBoard
defNoticeBoard =
    quickInit ( 0, 0 ) "" 0


{-| Full init of the NoticeBoard
-}
init : GlobalBasics.Pos -> NoticeBoardVisibility -> NoticeBoardMove -> Int -> NoticeBoard
init pos noticeBoardVisibility noticeBoardMove fontSize =
    { pos = pos
    , noticeBoardVisibility = noticeBoardVisibility
    , noticeBoardMove = noticeBoardMove
    , fontSize = fontSize
    }


{-| Quick init, always visible.
-}
quickInit : GlobalBasics.Pos -> String -> Int -> NoticeBoard
quickInit pos info fontSize =
    { pos = pos
    , noticeBoardVisibility = Visible info NoNextNoticeBoardVisibility
    , noticeBoardMove = NoNextNoticeBoardMove
    , fontSize = fontSize
    }

boundary : (Float,Float) -> (Float,Float) -> List Brick.Brick
boundary (x,y) (width,height) =
    let
        (blockX,blockY) = GlobalBasics.blockSize
        tempBrick = Brick.quickInit_ (GlobalBasics.blockPos_ (x,y)) (width*blockX,height*blockY) "#F5F5F5"
    in
    [{tempBrick | brickCollision = Brick.NoCollide Brick.NoNextBrickCollision}]
                        

{-| update function of noticeBoard unit
-}
update : ( { model | player : Player.Player, noticeBoards : Array NoticeBoard, actEvent : Array Event.ActEvent }, Cmd MainType.Msg ) -> ( { model | player : Player.Player, noticeBoards : Array NoticeBoard, actEvent : Array Event.ActEvent }, Cmd MainType.Msg )
update ( model, cmd ) =
    ( List.foldl updateOneNoticeBoard model (List.range 0 (Array.length model.noticeBoards - 1)), cmd )


{-| update one noticeBoard. Used in update. Not exposed.
-}
updateOneNoticeBoard : Int -> { model | player : Player.Player, noticeBoards : Array NoticeBoard, actEvent : Array Event.ActEvent } -> { model | player : Player.Player, noticeBoards : Array NoticeBoard, actEvent : Array Event.ActEvent }
updateOneNoticeBoard id model =
    model
        |> updateOneNoticeBoardVisibility id
        |> updateOneNoticeBoardMove id


{-| update visibility of notice board, used in update, not exposed.
-}
updateOneNoticeBoardVisibility : Int -> { model | player : Player.Player, noticeBoards : Array NoticeBoard, actEvent : Array Event.ActEvent } -> { model | player : Player.Player, noticeBoards : Array NoticeBoard, actEvent : Array Event.ActEvent }
updateOneNoticeBoardVisibility id model =
    let
        noticeBoard =
            Array.get id model.noticeBoards
                |> withDefault defNoticeBoard

        nextVisibility =
            case noticeBoard.noticeBoardVisibility of
                Visible info tempNextVisibility ->
                    tempNextVisibility

                Invisible tempNextVisibility ->
                    tempNextVisibility

                _ ->
                    NoNextNoticeBoardVisibility

        newNoticeBoardVisibility =
            case nextVisibility of
                VisibleAfterEvent eventID info nextNextVisibility ->
                    if Event.ifActEventById model eventID == Event.ActEventAct then
                        Visible info nextNextVisibility

                    else
                        noticeBoard.noticeBoardVisibility

                InvisibleAfterEvent eventID nextNextVisibility ->
                    if Event.ifActEventById model eventID == Event.ActEventAct then
                        Invisible nextNextVisibility

                    else
                        noticeBoard.noticeBoardVisibility

                _ ->
                    noticeBoard.noticeBoardVisibility

        newNoticeBoard =
            { noticeBoard | noticeBoardVisibility = newNoticeBoardVisibility }

        newNoticeBoards =
            Array.set id newNoticeBoard model.noticeBoards

        newModel =
            { model | noticeBoards = newNoticeBoards }
    in
    newModel


{-| update noticeBoard move event. Used in `updateOneNoticeBoard`. Not exposed
-}
updateOneNoticeBoardMove : Int -> { model | player : Player.Player, noticeBoards : Array NoticeBoard, actEvent : Array Event.ActEvent } -> { model | player : Player.Player, noticeBoards : Array NoticeBoard, actEvent : Array Event.ActEvent }
updateOneNoticeBoardMove id model =
    let
        noticeBoard =
            Array.get id model.noticeBoards
                |> withDefault defNoticeBoard
    in
    case noticeBoard.noticeBoardMove of
        Move posArray speed eventID nextMove ->
            if Array.isEmpty posArray then
                if Event.ifActEventById model eventID == Event.ActEventAct then
                    let
                        newNoticeBoard =
                            { noticeBoard | noticeBoardMove = nextMove }

                        newNoticeBoards =
                            Array.set id newNoticeBoard model.noticeBoards
                    in
                    { model | noticeBoards = newNoticeBoards }

                else
                    model

            else
                let
                    destination =
                        withDefault GlobalBasics.defPos (Array.get 0 posArray)
                in
                if GlobalBasics.distPosPos destination noticeBoard.pos <= speed then
                    let
                        newPosArray =
                            Array.slice 1 (Array.length posArray) posArray

                        newNoticeBoard =
                            { noticeBoard | pos = destination, noticeBoardMove = Move newPosArray speed eventID nextMove }

                        newNoticeBoards =
                            Array.set id newNoticeBoard model.noticeBoards
                    in
                    { model | noticeBoards = newNoticeBoards }

                else
                    let
                        ( destinationX, destinationY ) =
                            destination

                        ( posX, posY ) =
                            noticeBoard.pos

                        newPos =
                            if posX == destinationX then
                                if destinationY > posY then
                                    ( posX, posY + speed )

                                else
                                    ( posX, posY - speed )

                            else
                                let
                                    degree =
                                        atan ((destinationY - posY) / (destinationX - posX))

                                    deltaX =
                                        if destinationX > posX then
                                            abs (speed * cos degree)

                                        else
                                            -(abs (speed * cos degree))

                                    deltaY =
                                        if destinationY > posY then
                                            abs (speed * sin degree)

                                        else
                                            -(abs (speed * sin degree))
                                in
                                ( posX + deltaX, posY + deltaY )

                        newNoticeBoard =
                            { noticeBoard | pos = newPos }

                        newNoticeBoards =
                            Array.set id newNoticeBoard model.noticeBoards
                    in
                    { model | noticeBoards = newNoticeBoards }

        NoNextNoticeBoardMove ->
            model


{-| view one noticeBoard, used in view, not exposed.
-}
viewOneNoticeBoard : { model | windowBoundary : GlobalBasics.Pos, levelBoundary : GlobalBasics.Pos, player : Player.Player } -> NoticeBoard -> List (Svg MainType.Msg)
viewOneNoticeBoard model noticeBoard =
    case noticeBoard.noticeBoardVisibility of
        Visible info nextVisibility ->
            let
                ( noticeBoardX, noticeBoardY ) =
                    noticeBoard.pos
            in
            [ Svg.text_
                [ SvgAttr.x (String.fromFloat (ViewMove.deltaX model + noticeBoardX))
                , SvgAttr.y (String.fromFloat (ViewMove.deltaY model + noticeBoardY))
                , SvgAttr.fontSize (String.fromInt noticeBoard.fontSize ++ "px")
                , SvgAttr.textAnchor "middle"
                , SvgAttr.fill "#000000"
                ]
                [ text info ]
            ]

        Invisible _ ->
            []

        _ ->
            []


{-| view function of noticeBoard
-}
view : { model | noticeBoards : Array NoticeBoard, windowBoundary : GlobalBasics.Pos, levelBoundary : GlobalBasics.Pos, player : Player.Player } -> List (Svg MainType.Msg)
view model =
    let
        noticeBoardsList =
            Array.toList model.noticeBoards

        svgNoticeBoardListList =
            List.map (\noticeBoard -> viewOneNoticeBoard model noticeBoard) noticeBoardsList
    in
    List.concat svgNoticeBoardListList
