module NoticeBoard exposing (NoticeBoard)
{-| The notice board only acts as displaying the text, it only has visibility

# NoticeBoard
@docs NoticeBoard

-}

import GlobalBasics

{-| Same as Brick's visibility, except adding new words that can be changed. The words are stored in
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
    | NoNextBrickVisibility


{-| Definition of noticeBoard, it's information is in String.
-}
type alias NoticeBoard =
    { pos : GlobalBasics.Pos
    , visibility : NoticeBoardVisibility
    }