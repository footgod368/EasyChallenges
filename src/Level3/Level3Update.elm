module Level3.Level3Update exposing (testUpdate, update)

{-| update Level3


# update

update

-}

import Level3.Level3Init as Level3Init
import Level3.Level3Type as Level3Type
import MainFunction.MainType as MainType
import Modules.Boundary as Boundary
import Modules.Brick as Brick
import Modules.EndPoint as EndPoint
import Modules.Event as Event
import Modules.GameControl as GameControl
import Modules.NoticeBoard as NoticeBoard
import Modules.Player as Player
import Needle
import SavePoint


{-| `update` of Level3
-}
update : MainType.Msg -> Level3Type.Model -> ( Level3Type.Model, Cmd MainType.Msg )
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
                            |> Player.updateJustPlayerPos

                    else
                        ( model, Cmd.none )
            in
            if List.member 82 newModel.keyPressed then
                SavePoint.updateReset Level3Init.init ( model, Cmd.none )

            else
                ( newModel, cmd )

        buttonMsg ->
            GameControl.update buttonMsg ( model, Cmd.none )


testUpdate : Int -> Level3Type.Model -> Level3Type.Model
testUpdate times model =
    List.foldl
        (\i tempModel ->
            let
                ( newTempModel, cmd ) =
                    ( tempModel, Cmd.none )
                        |> Player.update
                        |> Event.update
                        |> Brick.update

                --|> Player.updateJustPlayerPos
            in
            newTempModel
        )
        model
        (List.range 0 times)
