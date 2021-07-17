module Level4Update exposing (testUpdate, update)

{-| update Level4


# update

update

-}

import Array exposing (Array)
import Boundary
import Brick
import EndPoint
import Event
import GameControl
import Level4Init
import Level4Type
import MainType
import Maybe exposing (withDefault)
import Needle
import NoticeBoard
import Player
import SavePoint


{-| `update` of Level4
-}
update : MainType.Msg -> Level4Type.Model -> ( Level4Type.Model, Cmd MainType.Msg )
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
                            |> Player.updateJustPlayerPos

                    else
                        ( model, Cmd.none )
            in
            if List.member 82 newModel.keyPressed then
                SavePoint.updateReset Level4Init.init ( model, Cmd.none )

            else
                ( newModel, cmd )

        buttonMsg ->
            GameControl.update buttonMsg ( model, Cmd.none )


testUpdate : Int -> Level4Type.Model -> Level4Type.Model
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
