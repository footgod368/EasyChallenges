module NoticeBoard exposing
    ( NoticeBoard
    , init, quickInit
    )

{-| The notice board only acts as displaying the text, it only has visibility


# NoticeBoard

@docs NoticeBoard


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
import Maybe exposing (withDefault)
import Player


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

{-|update visibility of notice board, used in update, not exposed.
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