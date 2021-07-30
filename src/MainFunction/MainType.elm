module MainFunction.MainType exposing
    ( Msg(..)
    , MainScene(..)
    )

{-| The main model that's used in main view and main update, stores all the information needed in this game


# Msg

@docs Msg


# MainScene

@docs MainScene

-}

import Browser.Dom exposing (Viewport)
import Time exposing (Posix)


{-| `MainScene` stores the game stage. Menu means Menu page, levelX means in level X.
-}
type MainScene
    = Menu
    | Level1
    | Level2
    | Level3
    | Level4
    | Level6
    | Level5


{-| `Msg` stores the callbacks of subscriptions. Tick means 8ms just passed, we need to update our game. KeyUp means
player unpress a key, KeyDown means player just press a key, OnMouseClick means player clicks a button, OnMouseDown
means player's mouse holds down on a button, OnMounseUp means player's mouse holds up from a button, OnMouseOver means
player's mouse is hover on a button, OnMouseOut means player's mouse is away from a button, GetViewPort means init
windowSize in init, Resize means in the game, player resize the window.
-}
type Msg
    = Tick Posix
    | KeyUp Int
    | KeyDown Int
    | OnMouseClick Int
    | OnMouseDown Int
    | OnMouseUp Int
    | OnMouseOver Int
    | OnMouseOut Int
    | GetViewport Viewport
    | Resize Int Int
