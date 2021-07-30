module Level6.Level6Update exposing (update)

{-| update Level6


# update

@docs update

-}

import Array exposing (Array)
import Level6.Level6Init as Level6Init
import Level6.Level6Type as Level6Type
import MainFunction.MainType as MainType
import Modules.Boundary as Boundary
import Modules.Brick as Brick
import Modules.EndPoint as EndPoint
import Modules.Event as Event
import Modules.GameControl as GameControl
import Modules.Needle as Needle
import Modules.NoticeBoard as NoticeBoard
import Modules.Player as Player
import Modules.SavePoint as SavePoint
import Modules.Sound as Sound


{-| `update` of Level6. See in level1Update, highly repetition.
-}
update : MainType.Msg -> Level6Type.Model -> ( Level6Type.Model, Cmd MainType.Msg )
update msg model =
    case msg of
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
                            |> Player.updateJustPlayerPos
                            |> GameControl.update (MainType.Tick timePassed)

                    else
                        ( model, Cmd.none )
                            |> GameControl.update (MainType.Tick timePassed)
            in
            if List.member 82 newModel.keyPressed then
                SavePoint.updateReset Level6Init.init ( model, Cmd.none )

            else
                let
                    newModel1 =
                        Event.deleteEventById newModel 34 7

                    newModel2 =
                        Event.deleteEventById newModel1 55 54
                in
                ( newModel2, cmd )

        buttonMsg ->
            GameControl.update buttonMsg ( model, Cmd.none )
