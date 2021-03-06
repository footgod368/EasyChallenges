module Level1.Level1Update exposing (update)

{-| update Level1


# update

@docs update

-}

import Level1.Level1Init as Level1Init
import Level1.Level1Type as Level1Type
import MainFunction.MainType as MainType
import Modules.Boundary as Boundary
import Modules.Brick as Brick
import Modules.EndPoint as EndPoint
import Modules.Event as Event
import Modules.GameControl as GameControl
import Modules.Monster as Monster
import Modules.Needle as Needle
import Modules.NoticeBoard as NoticeBoard
import Modules.Player as Player
import Modules.SavePoint as SavePoint
import Modules.Sound as Sound


{-| `update` of Level1. Handles Resize, GetViewPort which handles the windows size change correctly. Handles KeyUp,
KeyDown will change the keyPressed in the level model. Handles Tick, update each module individually.
-}
update : MainType.Msg -> Level1Type.Model -> ( Level1Type.Model, Cmd MainType.Msg )
update msg model =
    case msg of
        MainType.Resize width height ->
            ( { model | windowBoundary = ( toFloat width * 0.95, toFloat height * 0.95 ) }, Cmd.none )

        MainType.GetViewport viewport ->
            ( { model | windowBoundary = ( viewport.viewport.width * 0.95, viewport.viewport.height * 0.95 ) }, Cmd.none )

        MainType.KeyUp keyNum ->
            ( { model | keyPressed = List.filter (\x -> x /= keyNum) model.keyPressed }, Cmd.none )

        MainType.KeyDown keyNum ->
            ( { model | keyPressed = List.append [ keyNum ] model.keyPressed }, Cmd.none )

        MainType.Tick timePassed ->
            let
                ( newModel, cmd ) =
                    if model.player.liveState /= Player.Dead then
                        ( model, Cmd.none )
                            |> Player.update
                            |> Event.update
                            |> Brick.update
                            |> SavePoint.update
                            |> EndPoint.update
                            |> Boundary.update
                            |> NoticeBoard.update
                            |> Needle.update
                            |> Sound.update
                            |> Monster.update
                            |> Player.updateJustPlayerPos
                            |> checkPill
                            |> GameControl.update (MainType.Tick timePassed)

                    else
                        ( model, Cmd.none )
                            |> GameControl.update (MainType.Tick timePassed)
            in
            if List.member 82 newModel.keyPressed then
                SavePoint.updateReset Level1Init.init ( model, Cmd.none )

            else
                ( newModel, cmd )

        buttonMsg ->
            GameControl.update buttonMsg ( model, Cmd.none )


{-| check whether player gets the pill and kill them if so
-}
checkPill : ( Level1Type.Model, Cmd MainType.Msg ) -> ( Level1Type.Model, Cmd MainType.Msg )
checkPill ( model, cmd ) =
    if Event.ifActEventById model 13 == Event.ActEventAct then
        ( Player.playerKill model Player.StepOnNeedle, cmd )

    else
        ( model, cmd )
