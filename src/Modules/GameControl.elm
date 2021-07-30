port module Modules.GameControl exposing
    ( GameControl
    , init
    , update
    , view
    )

{-| The control box for the game, handles player's action: pause/continue


# Control

@docs GameControl


# Init

@docs init


# Update

@docs update


# View

@docs view

-}

import Array exposing (Array)
import Browser.Dom exposing (getViewport)
import GlobalFunction.GlobalBasics as GlobalBasics
import MainFunction.MainConstant as MainConstant
import MainFunction.MainType as MainType exposing (Msg(..))
import Maybe exposing (withDefault)
import Modules.Player as Player exposing (Player)
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr
import Svg.Events as SvgEvent
import Task


{-| ControlStatus records whether the player has pressed pause. Normal means the player doesn't open hint, Hint Int
means player open hint N = Int.
-}
type ControlStatus
    = Normal
    | Hint Int


{-| GameStatus records the current game status. buttonState stores the current button status, stores its color
representing different mode. nextLevel store which level the game'll go after the nextLevel button is pressed.
soundLoudness stores the current sound loudness, from 0 ~ 1.
-}
type alias GameControl =
    { controlStatus : ControlStatus
    , buttonState : Array String
    , hint : List (List String)
    , hintLength : Int
    , nextLevel : MainType.MainScene
    , soundLoudness : Float
    }


{-| Init one Level's gameControl, need to input which nextLevel will be and the details of the hints.
-}
init : MainType.MainScene -> List (List String) -> GameControl
init nextLevel hint =
    { controlStatus = Normal
    , buttonState =
        Array.fromList (List.map (\i -> MainConstant.buttonNormalColor) (List.range 0 5))
    , hint = hint
    , hintLength = List.length hint
    , nextLevel = nextLevel
    , soundLoudness = 1.0
    }


{-| Update gameControl, handles player's action correctly. Updates player's mouse actions (clicking buttons).
-}
update : MainType.Msg -> ( { model | gameControl : GameControl, mainScene : MainType.MainScene }, Cmd MainType.Msg ) -> ( { model | gameControl : GameControl, mainScene : MainType.MainScene }, Cmd MainType.Msg )
update msg ( model, cmd ) =
    case msg of
        OnMouseOver num ->
            let
                oldGameControl =
                    model.gameControl

                newGameControl =
                    { oldGameControl | buttonState = Array.set num MainConstant.buttonOverColor model.gameControl.buttonState }
            in
            ( { model | gameControl = newGameControl }, Cmd.batch [ cmd ] )

        OnMouseOut num ->
            let
                oldGameControl =
                    model.gameControl

                newGameControl =
                    { oldGameControl | buttonState = Array.set num MainConstant.buttonNormalColor model.gameControl.buttonState }
            in
            ( { model | gameControl = newGameControl }, Cmd.batch [ cmd ] )

        OnMouseDown num ->
            let
                oldGameControl =
                    model.gameControl

                newGameControl =
                    { oldGameControl | buttonState = Array.set num MainConstant.buttonDownColor model.gameControl.buttonState }
            in
            ( { model | gameControl = newGameControl }, Cmd.batch [ cmd ] )

        OnMouseUp num ->
            let
                ( newModel, newCmd ) =
                    --if joinRoomButtonStartId <= num && num <= joinRoomButtonEndId then
                    --    ( model, Cmd.batch [ cmd, consoleLog "joinRoom",  clientSend ("joinRoom " ++ String.fromInt (num - joinRoomButtonStartId)) ] )
                    --
                    --else
                    case num of
                        0 ->
                            --gameBack
                            ( { model | mainScene = MainType.Menu }, Cmd.batch [ cmd ] )

                        1 ->
                            --gameNextLevel
                            ( { model | mainScene = model.gameControl.nextLevel }, Task.perform MainType.GetViewport getViewport )

                        2 ->
                            --gameHint
                            let
                                oldOldGameControl =
                                    model.gameControl

                                oldNewGameControl =
                                    case oldOldGameControl.controlStatus of
                                        Normal ->
                                            { oldOldGameControl | controlStatus = Hint 0 }

                                        Hint n ->
                                            { oldOldGameControl | controlStatus = Hint (modBy model.gameControl.hintLength (n + 1)) }
                            in
                            ( { model | gameControl = oldNewGameControl }, Cmd.batch [ cmd ] )

                        3 ->
                            --gameHintCloseButton
                            let
                                oldOldGameControl =
                                    model.gameControl

                                oldNewGameControl =
                                    { oldOldGameControl | controlStatus = Normal }
                            in
                            ( { model | gameControl = oldNewGameControl }, Cmd.batch [ cmd ] )

                        5 ->
                            --soundQuieterButton
                            let
                                oldOldGameControl =
                                    model.gameControl

                                oldNewGameControl =
                                    { oldOldGameControl | soundLoudness = max (oldOldGameControl.soundLoudness - 0.1) 0 }
                            in
                            ( { model | gameControl = oldNewGameControl }
                            , Cmd.batch
                                [ changeVolume ( "BackGround", oldNewGameControl.soundLoudness )
                                , changeVolume ( "Jump", oldNewGameControl.soundLoudness )
                                , changeVolume ( "RandomBox", oldNewGameControl.soundLoudness )
                                , changeVolume ( "Needle", oldNewGameControl.soundLoudness )
                                , changeVolume ( "Dead", oldNewGameControl.soundLoudness )
                                , changeVolume ( "Sword", oldNewGameControl.soundLoudness )
                                ]
                            )

                        4 ->
                            --soundLouderButton
                            let
                                oldOldGameControl =
                                    model.gameControl

                                oldNewGameControl =
                                    { oldOldGameControl | soundLoudness = min (oldOldGameControl.soundLoudness + 0.1) 1.0 }
                            in
                            ( { model | gameControl = oldNewGameControl }
                            , Cmd.batch
                                [ changeVolume ( "BackGround", oldNewGameControl.soundLoudness )
                                , changeVolume ( "Jump", oldNewGameControl.soundLoudness )
                                , changeVolume ( "RandomBox", oldNewGameControl.soundLoudness )
                                , changeVolume ( "Needle", oldNewGameControl.soundLoudness )
                                , changeVolume ( "Dead", oldNewGameControl.soundLoudness )
                                , changeVolume ( "Sword", oldNewGameControl.soundLoudness )
                                ]
                            )

                        _ ->
                            ( model, Cmd.batch [ cmd ] )

                oldGameControl =
                    newModel.gameControl

                newGameControl =
                    { oldGameControl | buttonState = Array.set num MainConstant.buttonOverColor newModel.gameControl.buttonState }
            in
            ( { newModel | gameControl = newGameControl }, Cmd.batch [ newCmd ] )

        _ ->
            ( model
            , Cmd.batch
                [ changeVolume ( "BackGround", model.gameControl.soundLoudness )
                , changeVolume ( "Jump", model.gameControl.soundLoudness )
                , changeVolume ( "RandomBox", model.gameControl.soundLoudness )
                , changeVolume ( "Needle", model.gameControl.soundLoudness )
                , changeVolume ( "Dead", model.gameControl.soundLoudness )
                , changeVolume ( "Sword", model.gameControl.soundLoudness )
                ]
            )


viewOneButton : { model | gameControl : GameControl, windowBoundary : GlobalBasics.Pos, player : Player } -> ( Float, Float ) -> ( Float, Float ) -> Int -> String -> List (Svg MainType.Msg)
viewOneButton model ( x, y ) ( width, height ) buttonID text =
    [ Svg.rect
        [ SvgAttr.x (String.fromFloat x)
        , SvgAttr.y (String.fromFloat y)
        , SvgAttr.width (String.fromFloat width)
        , SvgAttr.height (String.fromFloat height)
        , SvgAttr.fill (withDefault "White" (Array.get buttonID model.gameControl.buttonState))
        ]
        []
    , Svg.text_
        [ SvgAttr.x (String.fromFloat (x + width / 2))
        , SvgAttr.y (String.fromFloat (y + height / 2 + 11.0))
        , SvgAttr.fontSize "30"
        , SvgAttr.textAnchor "middle"
        , SvgAttr.fill "#e85239"
        ]
        [ Svg.text text ]
    , Svg.rect
        [ SvgAttr.x (String.fromFloat x)
        , SvgAttr.y (String.fromFloat y)
        , SvgAttr.width (String.fromFloat width)
        , SvgAttr.height (String.fromFloat height)
        , SvgAttr.fill "#00000000"
        , SvgEvent.onMouseOver (MainType.OnMouseOver buttonID)
        , SvgEvent.onMouseOut (MainType.OnMouseOut buttonID)
        , SvgEvent.onMouseDown (MainType.OnMouseDown buttonID)
        , SvgEvent.onMouseUp (MainType.OnMouseUp buttonID)
        ]
        []
    ]


viewOneHintLine : ( Float, Float ) -> String -> List (Svg MainType.Msg)
viewOneHintLine ( x, y ) text =
    [ Svg.text_
        [ SvgAttr.x (String.fromFloat x)
        , SvgAttr.y (String.fromFloat y)
        , SvgAttr.fontSize "30"
        , SvgAttr.textAnchor "middle"
        , SvgAttr.fill "#e85239"
        ]
        [ Svg.text text ]
    ]


viewOneHint : ( Float, Float ) -> List String -> List (Svg MainType.Msg)
viewOneHint ( x, y ) textList =
    List.foldl
        (\text ( list, i ) ->
            let
                oneText =
                    viewOneHintLine ( x, y + 50.0 * i ) text
            in
            ( oneText :: list, i + 1 )
        )
        ( [], 0 )
        textList
        |> Tuple.first
        |> List.concat


{-| View function for gameControl, draw pause, back buttons
-}
view : { model | gameControl : GameControl, windowBoundary : GlobalBasics.Pos, player : Player } -> List (Svg MainType.Msg)
view model =
    let
        ( windowBoundaryX, windowBoundaryY ) =
            model.windowBoundary
    in
    List.concat
        [ viewOneButton
            model
            ( windowBoundaryX - 150.0, 30.0 )
            ( 100.0, 50.0 )
            MainConstant.gameBackButton
            "Back"
        , viewOneButton
            model
            ( windowBoundaryX - 150.0, 100.0 )
            ( 160.0, 50.0 )
            MainConstant.soundLouderButton
            "Volume +"
        , viewOneButton
            model
            ( windowBoundaryX - 340.0, 100.0 )
            ( 160.0, 50.0 )
            MainConstant.soundQuieterButton
            "Volume -"
        , if model.player.liveState == Player.Win then
            viewOneButton
                model
                ( windowBoundaryX / 2.0, windowBoundaryY / 2.0 + 200.0 )
                ( 200.0, 100.0 )
                MainConstant.gameNextLevelButton
                "Next Level"

          else
            case model.gameControl.controlStatus of
                Normal ->
                    viewOneButton
                        model
                        ( windowBoundaryX - 340.0, 30.0 )
                        ( 140.0, 50.0 )
                        MainConstant.gameHintButton
                        "Hint"

                Hint n ->
                    List.concat
                        [ [ Svg.rect
                                [ SvgAttr.x (String.fromFloat (windowBoundaryX / 2.0 - 300))
                                , SvgAttr.y (String.fromFloat (windowBoundaryY / 2.0 - 150))
                                , SvgAttr.width (String.fromFloat 600)
                                , SvgAttr.height (String.fromFloat 300)
                                , SvgAttr.fill "#FAFAFA"
                                ]
                                []
                          ]
                        , let
                            hintList =
                                model.gameControl.hint
                                    |> List.drop n
                                    |> List.head
                                    |> withDefault []
                          in
                          viewOneHint ( windowBoundaryX / 2.0, windowBoundaryY / 2.0 - 120 ) hintList
                        , viewOneButton
                            model
                            ( windowBoundaryX / 2.0 - 75.0, windowBoundaryY / 2.0 + 80.0 )
                            ( 150.0, 50.0 )
                            MainConstant.gameHintButton
                            "Next Hint"
                        , viewOneButton
                            model
                            ( windowBoundaryX / 2.0 + 170.0, windowBoundaryY / 2.0 + 80.0 )
                            ( 100.0, 50.0 )
                            MainConstant.gameHintCloseButton
                            "Close"
                        ]
        ]


{-| This is a port function that can help you to control the volume of the music.
For example, if you want to change the volume of a audio tag, you need to make sure that the audio tag is written like this in view:

    audio
        [ Html.Attributes.src "assets/audio/sample.ogg"
        , Html.Attributes.id "audio-sample"
        ]
        []

Change the id to a name that you want.

Then, if you want to change the volume on the music to 95%, you just need to call:

    changeVolume ( "audio-sample", 0.95 )

Please note that the function returns a Cmd Msg. Please return it in the Update function. When you successfully call the changeVolume function, it will print a console log in the browser like this

    Change_Volume audio - sample 0.9

-}
port changeVolume : ( String, Float ) -> Cmd msg


{-| This is a port function that can help you to pause the music.
For example, if you want to pause a music that is tagged "audio-sample", please write like this:
Change the id to a name that you want.

    pause "audio-sample"

Please note that the function returns a Cmd Msg. Please return it in the Update function. When you successfully call the function, it will print a console log in the browser like this

    Pause: audio - sample

-}
port pause : String -> Cmd msg


{-| This is a port function that can help you to start the music.
For example, if you want to start a music that is tagged "audio-sample", please write like this:
Change the id to a name that you want.

    start "audio-sample"

Please note that the function returns a Cmd Msg. Please return it in the Update function. When you successfully call the function, it will print a console log in the browser like this

    Start_Music: audio - sample

-}
port start : String -> Cmd msg


{-| This is a port function that can help you to set the progression bar of the music.
For example, if you want to set a music that is tagged "audio-sample" to 10s, please write like this:
Change the id to a name that you want.

    settime ( "audio-sample", 10 )

Please note that the function returns a Cmd Msg. Please return it in the Update function. When you successfully call the function, it will print a console log in the browser like this

    Set_Play_Time: audio - sample 10

-}
port settime : ( String, Float ) -> Cmd msg


{-| This is a port function that can help you to slow down or speed up the music.
For example, if you want to set the rate of a music that is tagged "audio-sample" to 0.5, please write like this:
Change the id to a name that you want.

    setrate ( "audio-sample", 0.5 )

Please note that the function returns a Cmd Msg. Please return it in the Update function. When you successfully call the function, it will print a console log in the browser like this

    Set_Music_Rate: audio - sample

-}
port setrate : ( String, Float ) -> Cmd msg
