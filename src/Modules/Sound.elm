module Modules.Sound exposing (..)

import Array exposing (Array)
import Html exposing (Html)
import Html.Attributes as HtmlAttr
import MainFunction.MainType as MainType
import Svg exposing (Svg)


backGroundLength : Int
backGroundLength =
    10


jumpLength : Int
jumpLength =
    30


randomBoxLength : Int
randomBoxLength =
    60


needleLength : Int
needleLength =
    30


deadLength : Int
deadLength =
    200


swordLength : Int
swordLength =
    200


{-| The effect of sounds in the game
-}
type SoundEffect
    = BackGround
    | Jump
    | RandomBox
    | Needle
    | Dead
    | Sword


{-| The trigger of sound, Activated and None is reserved for progress
-}
type SoundTrigger
    = Event Int SoundEffect
    | Activated Int SoundEffect SoundTrigger
    | None


{-| Definition of sound
-}
type alias Sound =
    { soundTrigger : List SoundTrigger
    }

