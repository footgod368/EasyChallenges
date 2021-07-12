module NoticeBoard exposing (NoticeBoard)
{-| The notice board only acts as displaying the text, it only has visibility

# NoticeBoard
@docs NoticeBoard

-}

import Array exposing (Array)
import GlobalBasics

{-| Almost same as Brick's visibility, except adding new words that can be changed. The words are stored in
NoticeBoardVisibility. You can use it like this:

    newNoticeBoardVisibility : NoticeBoardVisibility
    newNoticeBoardVisibility =
        Visible "Hello"
            ( VisibleAfterEvent 1 "Aha, you find how to walk!"
                ( InvisibleAfterEvent 2 NoNextBrickVisibility
                )
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

{-| Same as Brick move.
-}
type NoticeBoardMove
    = Move (Array GlobalBasics.Pos) Float Int NoticeBoardMove
    | NoNextNoticeBoardMove

{-| Definition of noticeBoard, it's information is in String.
-}
type alias NoticeBoard =
    { pos : GlobalBasics.Pos
    , visibility : NoticeBoardVisibility
    , move : NoticeBoardMove
    , fontSize : Int
    }

{-| Full init of the NoticeBoard
-}
init : GlobalBasics.Pos -> NoticeBoardVisibility -> NoticeBoardMove -> Int -> NoticeBoard
init pos noticeBoardVisibility noticeBoardMove fontSize =
    { pos = pos
    , visibility = noticeBoardVisibility
    , move = noticeBoardMove
    , fontSize = fontSize
    }

{-| Quick init, always visible.
-}
quickInit : GlobalBasics.Pos -> String -> Int -> NoticeBoard
quickInit pos info fontSize =
    { pos = pos
    , visibility = Visible info NoNextNoticeBoardVisibility
    , move = NoNextNoticeBoardMove
    , fontSize = fontSize
    }