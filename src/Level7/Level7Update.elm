module Level7.Level7Update exposing (update)

{-| update Level1


# update

@docs update

-}

import Level7.Level7Init as Level0Init
import Level7.Level7Type as Level0Type
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


{-| `update` of Level1
-}
update : MainType.Msg -> Level0Type.Model -> ( Level0Type.Model, Cmd MainType.Msg )
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
                            |> Player.updateJustPlayerPos
                            |> GameControl.update ( MainType.Tick timePassed )

                    else
                        ( model, Cmd.none )
                            |> GameControl.update ( MainType.Tick timePassed )
            in
            if List.member 82 newModel.keyPressed then
                SavePoint.updateReset Level0Init.init ( model, Cmd.none )

            else
                ( newModel, cmd )

        buttonMsg ->
            GameControl.update buttonMsg ( model, Cmd.none )
