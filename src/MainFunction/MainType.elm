module MainType exposing
    ( Msg(..)
    , MainScene(..)
    )

{-| The main model that's used in main view and main update, stores all the information needed in this game


# Msg

@docs Msg

-}

import Browser.Dom exposing (Viewport)
import Time exposing (Posix)


{-| `MainScene` stores the game stage.
-}
type MainScene
    = Menu
    | Level0
    | Level1
    | Level2
    | Level3
    | Level4


{-| `Msg` stores the callbacks of subscriptions
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
