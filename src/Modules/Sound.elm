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


{-| Input the list of soundTrigger to init
-}
init : List SoundTrigger -> Sound
init soundTriggerList =
    Sound soundTriggerList


viewOneSoundTrigger : SoundTrigger -> List (Svg MainType.Msg)
viewOneSoundTrigger soundTrigger =
    case soundTrigger of
        Event eventId soundEffect ->
            []

        Activated n soundEffect nextSoundTrigger ->
            [ Html.audio
                (List.append
                    [ HtmlAttr.controls True
                    , HtmlAttr.autoplay True
                    , HtmlAttr.loop False
                    ]
                    (case soundEffect of
                        BackGround ->
                            [ HtmlAttr.src "assets/backgroundMusic.ogg"
                            , HtmlAttr.id "BackGround"
                            ]

                        Jump ->
                            [ HtmlAttr.src "assets/jumpMusic.ogg"
                            , HtmlAttr.id "Jump"
                            ]

                        RandomBox ->
                            [ HtmlAttr.src "assets/randomBoxMusic.ogg"
                            , HtmlAttr.id "RandomBox"
                            ]

                        Needle ->
                            [ HtmlAttr.src "assets/needleMusic.ogg"
                            , HtmlAttr.id "Needle"
                            ]

                        Sword ->
                            [ HtmlAttr.src "assets/swordMusic.ogg"
                            , HtmlAttr.id "Sword"
                            ]

                        Dead ->
                            [ HtmlAttr.src "assets/deadMusic.ogg"
                            , HtmlAttr.id "Dead"
                            ]
                    )
                )
                []
            ]

        None ->
            []

