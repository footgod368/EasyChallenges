module MainFunction.MainConstant exposing
    ( menuButtonLevel0, menuButtonLevel1, menuButtonLevel2, menuButtonLevel3, menuButtonLevel4,menuButtonLevel5
    , gameBackButton, gameNextLevelButton
    , buttonNormalColor, buttonDownColor, buttonOverColor
    )

{-| Constants used in all places.


# Menu

@docs menuButtonLevel0, menuButtonLevel1, menuButtonLevel2, menuButtonLevel3, menuButtonLevel4, menuButtonLevel5
@docs menuButtonLevel6


# Game

@docs gameBackButton, gameNextLevelButton


# Button

@docs buttonNormalColor, buttonDownColor, buttonOverColor

-}


{-| Id of button
-}
menuButtonLevel0 : Int
menuButtonLevel0 =
    0


{-| Id of button
-}
menuButtonLevel1 : Int
menuButtonLevel1 =
    1


{-| Id of button
-}
menuButtonLevel2 : Int
menuButtonLevel2 =
    2


{-| Id of button
-}
menuButtonLevel3 : Int
menuButtonLevel3 =
    3


{-| Id of button
-}
menuButtonLevel4 : Int
menuButtonLevel4 =
    4


{-| Id of button
-}
menuButtonLevel6 : Int
menuButtonLevel6 =
    6


{-| Id of button
-}
menuButtonLevel5 : Int
menuButtonLevel5 =
    5

{-| Id of button
-}
gameBackButton : Int
gameBackButton =
    0


{-| Id of button
-}
gameNextLevelButton : Int
gameNextLevelButton =
    1

{-| Id of button
-}
gameHintButton : Int
gameHintButton =
    2

{-| Id of button
-}
gameHintCloseButton : Int
gameHintCloseButton =
    3

{-| Normal color of button
-}
buttonNormalColor : String
buttonNormalColor =
    "#FFE6E8FF"


{-| Color of button when the mouse is on it
-}
buttonOverColor : String
buttonOverColor =
    "#FFE6E8CF"


{-| Color of button when it's pressed
-}
buttonDownColor : String
buttonDownColor =
    "#FFE6E89F"
