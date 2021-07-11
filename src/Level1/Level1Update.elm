module Level1Update exposing (testUpdate, update)

{-| update Level1


# update

update

-}

import Brick
import Event
import Level1Type
import MainType
import Player
import Boundary
import Level1Init


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
                    ( model, Cmd.none )
                        |> Player.update
                        |> Event.update
                        |> Brick.update
                        |> Boundary.update
                        |> Player.updateJustPlayerPos
            in
            if (Player.checkDead newModel.player) && (List.member 82 newModel.keyPressed) then
                Level1Init.init
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
