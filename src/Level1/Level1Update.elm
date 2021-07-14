module Level1Update exposing (testUpdate, update)

{-| update Level1


# update

update

-}

import Array exposing (Array)
import Boundary
import Brick
import EndPoint
import Event
import Level1Init
import Level1Type
import MainType
import Maybe exposing (withDefault)
import Monster
import Needle
import NoticeBoard
import Player
import SavePoint


{-| `update` of Level1
-}
update : MainType.Msg -> Level1Type.Model -> ( Level1Type.Model, Cmd MainType.Msg )
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
                            |> Monster.update
                            |> Player.updateJustPlayerPos

                    else
                        ( model, Cmd.none )

                initModel =
                    Tuple.first Level1Init.init

                oldSavePoints =
                    model.savePoints

                oldSaveNumber =
                    model.player.saveNumber

                oldDeadTimes =
                    model.player.deadTimes

                lastsavePoint =
                    Array.get oldSaveNumber oldSavePoints |> withDefault SavePoint.defSavePoint

                player =
                    Player.init lastsavePoint.pos

                newPlayer =
                    { player | saveNumber = oldSaveNumber, deadTimes = oldDeadTimes + 1 }

                newInitModel =
                    { initModel | savePoints = oldSavePoints, player = newPlayer }
            in
            if List.member 82 newModel.keyPressed then
                ( newInitModel, Tuple.second Level1Init.init )

            else
                ( newModel, cmd )

        _ ->
            ( model, Cmd.none )


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
