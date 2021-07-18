module Level1.Level1Update exposing (testUpdate, update)

{-| update Level1


# update

update

-}

import Modules.Boundary as Boundary
import Modules.Brick as Brick
import Modules.EndPoint as EndPoint
import Modules.Event as Event
import Modules.GameControl as GameControl
import Level1.Level1Init as Level1Init
import Level1.Level1Type as Level1Type
import MainFunction.MainType as MainType
import Modules.Monster as Monster
import Needle
import Modules.NoticeBoard as NoticeBoard
import Modules.Player as Player
import SavePoint


{-| `update` of Level1
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
                            |> Monster.update
                            |> Player.updateJustPlayerPos

                    else
                        ( model, Cmd.none )
            in
            if List.member 82 newModel.keyPressed then
                SavePoint.updateReset Level1Init.init ( model, Cmd.none )

            else
                ( newModel, cmd )

        buttonMsg ->
            GameControl.update buttonMsg ( model, Cmd.none )


testUpdate : Int -> Level1Type.Model -> Level1Type.Model
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
