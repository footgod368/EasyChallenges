module Modules.GameControl exposing
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


{-| ControlStatus records whether the player has pressed pause.
-}
type ControlStatus
    = Normal
    | Hint Int


{-| GameStatus records the current game status
-}
type alias GameControl =
    { controlStatus : ControlStatus
    , buttonState : Array String
    , hint : Array String
    , hintLength : Int
    , nextLevel : MainType.MainScene
    }


{-| Init one Level's gameControl
-}
init : MainType.MainScene -> Array String -> GameControl
init nextLevel hint =
    { controlStatus = Normal
    , buttonState =
        Array.fromList (List.map (\i -> MainConstant.buttonNormalColor) (List.range 0 2))
    , hint = hint
    , hintLength = Array.length hint
    , nextLevel = nextLevel
    }


{-| Update gameControl, handles player's action.
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
                            let
                                oldOldGameControl =
                                    model.gameControl

                                oldNewGameControl =
                                    case oldOldGameControl.controlStatus of
                                        Normal ->
                                            { oldOldGameControl | controlStatus = Hint 0 }

                                        Hint n ->
                                            { oldOldGameControl | controlStatus = Hint (modBy model.gameControl.hintLength (n + 1)) }

                                --gameHint
                            in
                            ( { model | gameControl = oldNewGameControl }, Cmd.batch [ cmd ] )

                        _ ->
                            ( model, Cmd.batch [ cmd ] )

                oldGameControl =
                    newModel.gameControl

                newGameControl =
                    { oldGameControl | buttonState = Array.set num MainConstant.buttonOverColor newModel.gameControl.buttonState }
            in
            ( { newModel | gameControl = newGameControl }, Cmd.batch [ newCmd ] )

        _ ->
            ( model, cmd )


viewOneButton : { model | gameControl : GameControl, windowBoundary : GlobalBasics.Pos, player : Player } -> ( Float, Float ) -> Int -> String -> List (Svg MainType.Msg)
viewOneButton model ( x, y ) buttonID text =
    [ Svg.rect
        [ SvgAttr.x (String.fromFloat x)
        , SvgAttr.y (String.fromFloat y)
        , SvgAttr.width "100"
        , SvgAttr.height "50"
        , SvgAttr.fill (withDefault "White" (Array.get buttonID model.gameControl.buttonState))
        ]
        []
    , Svg.text_
        [ SvgAttr.x (String.fromFloat (x + 50))
        , SvgAttr.y (String.fromFloat (y + 35.5))
        , SvgAttr.fontSize "30"
        , SvgAttr.textAnchor "middle"
        , SvgAttr.fill "#e85239"
        ]
        [ Svg.text "Back" ]
    , Svg.rect
        [ SvgAttr.x (String.fromFloat x)
        , SvgAttr.y (String.fromFloat y)
        , SvgAttr.width "100"
        , SvgAttr.height "50"
        , SvgAttr.fill "#00000000"
        , SvgEvent.onMouseOver (MainType.OnMouseOver buttonID)
        , SvgEvent.onMouseOut (MainType.OnMouseOut buttonID)
        , SvgEvent.onMouseDown (MainType.OnMouseDown buttonID)
        , SvgEvent.onMouseUp (MainType.OnMouseUp buttonID)
        ]
        []
    ]


{-| View function for gameControl, draw pause, back buttons
-}
view : { model | gameControl : GameControl, windowBoundary : GlobalBasics.Pos, player : Player } -> List (Svg MainType.Msg)
view model =
    let
        ( windowBoundaryX, windowBoundaryY ) =
            model.windowBoundary
    in
    List.concat
        [ viewOneButton model ( windowBoundaryX - 120.0, 30.0 ) MainConstant.gameBackButton "Back"
        , if model.player.liveState == Player.Win then
            [ Svg.rect
                [ SvgAttr.x (String.fromFloat (windowBoundaryX / 2.0))
                , SvgAttr.y (String.fromFloat (windowBoundaryY / 2.0))
                , SvgAttr.width "200"
                , SvgAttr.height "100"
                , SvgAttr.fill (withDefault "White" (Array.get MainConstant.gameNextLevelButton model.gameControl.buttonState))
                ]
                []
            , Svg.text_
                [ SvgAttr.x (String.fromFloat (windowBoundaryX / 2.0 + 100.0))
                , SvgAttr.y (String.fromFloat (windowBoundaryY / 2.0 + 50.0))
                , SvgAttr.fontSize "30"
                , SvgAttr.textAnchor "middle"
                , SvgAttr.fill "#e85239"
                ]
                [ Svg.text "Next Level" ]
            , Svg.rect
                [ SvgAttr.x (String.fromFloat (windowBoundaryX / 2.0))
                , SvgAttr.y (String.fromFloat (windowBoundaryY / 2.0))
                , SvgAttr.width "200"
                , SvgAttr.height "100"
                , SvgAttr.fill "#00000000"
                , SvgEvent.onMouseOver (MainType.OnMouseOver MainConstant.gameNextLevelButton)
                , SvgEvent.onMouseOut (MainType.OnMouseOut MainConstant.gameNextLevelButton)
                , SvgEvent.onMouseDown (MainType.OnMouseDown MainConstant.gameNextLevelButton)
                , SvgEvent.onMouseUp (MainType.OnMouseUp MainConstant.gameNextLevelButton)
                ]
                []
            ]

          else
            [--Svg.rect
             --    [ SvgAttr.x (String.fromFloat (windowBoundaryX / 2.0))
             --    , SvgAttr.y (String.fromFloat (windowBoundaryY / 2.0))
             --    , SvgAttr.width "200"
             --    , SvgAttr.height "100"
             --    , SvgAttr.fill "#000000"
             --    ]
             --    []
            ]

        --, case model.gameControl.controlStatus of
        --    Normal ->
        ]
