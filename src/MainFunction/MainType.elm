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


{-| `MainScene` stores the game stage.
-}
type MainScene
    = Menu
    | Level1
    | Level2
    | Level3
    | Level4
    | Level6
    | Level5
    | Level7


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
    | Resize Int Int
