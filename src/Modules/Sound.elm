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


{-| Play the sound
-}
view : { model | sound : Sound } -> List (Svg MainType.Msg)
view model =
    List.concat
        [ [ Html.audio
                [ HtmlAttr.controls True
                , HtmlAttr.src "assets/backgroundMusic.ogg"
                , HtmlAttr.id "BackGround"
                , HtmlAttr.autoplay True
                , HtmlAttr.loop True
                ]
                []
          ]
        , List.concat (List.map viewOneSoundTrigger model.sound.soundTrigger)
        ]


updateOneSoundTrigger : { model | actEvent : Array { id : Int, name : String} } -> SoundTrigger -> SoundTrigger
updateOneSoundTrigger model soundTrigger =
    case soundTrigger of
        Event eventId soundEffect ->
            if Array.foldl
               (\actEvent sum ->
                   if actEvent.id == eventId then
                       sum + 1

                   else
                       sum
               )
               0
               model.actEvent
               /= 0 then
                case soundEffect of
                    BackGround ->
                        Activated backGroundLength soundEffect soundTrigger

                    Jump ->
                        Activated jumpLength soundEffect soundTrigger

                    RandomBox ->
                        Activated randomBoxLength soundEffect soundTrigger

                    Needle ->
                        Activated needleLength soundEffect soundTrigger

                    Dead ->
                        Activated deadLength soundEffect soundTrigger

                    Sword ->
                        Activated swordLength soundEffect soundTrigger

            else
                soundTrigger

        Activated timeLeft soundEffect nextSoundTrigger ->
            if timeLeft <= 0 then
                nextSoundTrigger

            else
                Activated (timeLeft - 1) soundEffect nextSoundTrigger

        None ->
            None

