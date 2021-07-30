module MainFunction.MainConstant exposing
    ( soundLouderButton, soundQuieterButton
    , menuButtonLevel1, menuButtonLevel2, menuButtonLevel3, menuButtonLevel4, menuButtonLevel5
    , menuButtonLevel6
    , gameBackButton, gameNextLevelButton, gameHintButton, gameHintCloseButton
    , buttonNormalColor, buttonDownColor, buttonOverColor
    )

{-| Constants used in all places.


# Global

@docs soundLouderButton, soundQuieterButton


# Menu

@docs menuButtonLevel1, menuButtonLevel2, menuButtonLevel3, menuButtonLevel4, menuButtonLevel5
@docs menuButtonLevel6


# Game

@docs gameBackButton, gameNextLevelButton, gameHintButton, gameHintCloseButton


# Button

@docs buttonNormalColor, buttonDownColor, buttonOverColor

-}


{-| Id of button, the button that goes to level1 in menu page.
-}
menuButtonLevel1 : Int
menuButtonLevel1 =
    1


{-| Id of button, the button that goes to level2 in menu page.
-}
menuButtonLevel2 : Int
menuButtonLevel2 =
    2


{-| Id of button, the button that goes to level3 in menu page.
-}
menuButtonLevel3 : Int
menuButtonLevel3 =
    3


{-| Id of button, the button that goes to level4 in menu page.
-}
menuButtonLevel4 : Int
menuButtonLevel4 =
    4


{-| Id of button, the button that goes to level5 in menu page.
-}
menuButtonLevel5 : Int
menuButtonLevel5 =
    5


{-| Id of button, the button that goes to level6 in menu page.
-}
menuButtonLevel6 : Int
menuButtonLevel6 =
    6


{-| Id of button, the button that goes to menu page in game.
-}
gameBackButton : Int
gameBackButton =
    0


{-| Id of button, the button that goes to next level in each level.
-}
gameNextLevelButton : Int
gameNextLevelButton =
    1


{-| Id of button, the button that shows player hint in each level.
-}
gameHintButton : Int
gameHintButton =
    2


{-| Id of button, the button that closes hint page in each level.
-}
gameHintCloseButton : Int
gameHintCloseButton =
    3


{-| button id, the button that makes sound lounder in each level.
-}
soundLouderButton : Int
soundLouderButton =
    4


{-| button id, the button that makes sound quieter in each level.
-}
soundQuieterButton : Int
soundQuieterButton =
    5


{-| Normal color of button. Works for all buttons.
-}
buttonNormalColor : String
buttonNormalColor =
    "#FFE6E8FF"


{-| Color of button when the mouse is on it. Works for all buttons.
-}
buttonOverColor : String
buttonOverColor =
    "#FFE6E8CF"


{-| Color of button when it's pressed. Works for all buttons.
-}
buttonDownColor : String
buttonDownColor =
    "#FFE6E89F"
