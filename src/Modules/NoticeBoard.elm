module Modules.NoticeBoard exposing
    ( NoticeBoard, NoticeBoardVisibility(..)
    , init, quickInit, boundary, boundaryCollide
    , update
    , view
    )

{-| The notice board only acts as displaying the text, it only has visibility


# NoticeBoard

@docs NoticeBoard, NoticeBoardVisibility


# Init

@docs init, quickInit, boundary, boundaryCollide


# Update

@docs update


# View

@docs view

-}

import Array exposing (Array)
import GlobalFunction.GlobalBasics as GlobalBasics
import GlobalFunction.GlobalModule as GlobalModule
import Html.Attributes exposing (height, width)
import MainFunction.MainType as MainType
import Maybe exposing (withDefault)
import Modules.Brick as Brick
import Modules.Event as Event
import Modules.Player as Player
import Modules.ViewMove as ViewMove
import Svg exposing (Svg, text)
import Svg.Attributes as SvgAttr


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


{-| Definition of noticeBoard, it's information is in String.
-}
type alias NoticeBoard =
    { pos : GlobalBasics.Pos
    , noticeBoardVisibility : NoticeBoardVisibility
    , move : GlobalModule.Move
    , fontSize : Int
    }


{-| Used in withDefault, no actual use
-}
defNoticeBoard : NoticeBoard
defNoticeBoard =
    quickInit ( 0, 0 ) "" 0


{-| Full init of the NoticeBoard. See in level5Init for examples, it's quite easy to see how to use.
-}
init : GlobalBasics.Pos -> NoticeBoardVisibility -> GlobalModule.Move -> Int -> NoticeBoard
init pos noticeBoardVisibility noticeBoardMove fontSize =
    { pos = pos
    , noticeBoardVisibility = noticeBoardVisibility
    , move = noticeBoardMove
    , fontSize = fontSize
    }


{-| Quick init, always visible. See in level5Init for examples, it's quite easy to see how to use.
-}
quickInit : GlobalBasics.Pos -> String -> Int -> NoticeBoard
quickInit pos info fontSize =
    { pos = pos
    , noticeBoardVisibility = Visible info NoNextNoticeBoardVisibility
    , move = GlobalModule.NoNextMove
    , fontSize = fontSize
    }


{-| quick function to create a 'brick' with proper 'Detailed' type as the boundary of 'NoticeBoard'. See in level5Init
for examples, it's quite easy to see how to use.
-}
boundary : ( Float, Float ) -> ( Float, Float ) -> Brick.Brick
boundary ( x, y ) ( width, height ) =
    let
        ( blockX, blockY ) =
            GlobalBasics.blockSize

        tempBrick =
            Brick.initPosVolumeColor (GlobalBasics.blockPosFloat ( x, y )) ( width * blockX, height * blockY ) "#F5F5F5"
    in
    { tempBrick | collision = GlobalModule.NoCollide GlobalModule.NoNextCollision }


{-| quick function to create a 'brick' with proper 'Detailed' type as the boundary of 'NoticeBoard', which has
collision. See in level5Init for examples, it's quite easy to see how to use.
-}
boundaryCollide : ( Float, Float ) -> ( Float, Float ) -> Brick.Brick
boundaryCollide ( x, y ) ( width, height ) =
    let
        ( blockX, blockY ) =
            GlobalBasics.blockSize

        tempBrick =
            Brick.initPosVolumeColor (GlobalBasics.blockPosFloat ( x, y )) ( width * blockX, height * blockY ) "#F5F5F5"
    in
    { tempBrick | collision = GlobalModule.Collide GlobalModule.NoNextCollision }


{-| update function of noticeBoard unit. Will update the words on the noticeBoard individually.
-}
update : ( { model | player : Player.Player, noticeBoards : Array NoticeBoard, actEvent : Array Event.ActEvent }, Cmd MainType.Msg ) -> ( { model | player : Player.Player, noticeBoards : Array NoticeBoard, actEvent : Array Event.ActEvent }, Cmd MainType.Msg )
update ( model, cmd ) =
    ( List.foldl updateOneNoticeBoard model (List.range 0 (Array.length model.noticeBoards - 1)), cmd )


{-| update one noticeBoard. Used in update. Not exposed.
-}
updateOneNoticeBoard : Int -> { model | player : Player.Player, noticeBoards : Array NoticeBoard, actEvent : Array Event.ActEvent } -> { model | player : Player.Player, noticeBoards : Array NoticeBoard, actEvent : Array Event.ActEvent }
updateOneNoticeBoard id model =
    let
        oldNoticeBoard =
            Array.get id model.noticeBoards
                |> withDefault defNoticeBoard

        newNoticeBoard =
            GlobalModule.updateOneMove model oldNoticeBoard

        newNoticeBoards =
            Array.set id newNoticeBoard model.noticeBoards
    in
    { model | noticeBoards = newNoticeBoards }
        |> updateOneNoticeBoardVisibility id


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


{-| view function of noticeBoard. Will view its boundary and string showed on it.
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
