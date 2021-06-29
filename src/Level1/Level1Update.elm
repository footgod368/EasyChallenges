module Level1Update exposing (update, testUpdate)

{-| update Level1

# update

update

-}

import Level1Type
import MainType
import Event
import Player
import Brick

{-| `update` of Level1
-}
update : MainType.Msg -> Level1Type.Model -> ( Level1Type.Model, Cmd MainType.Msg )
update msg model =
    case msg of
        MainType.KeyUp keyNum ->
            ( { model | keyPressed = ( List.filter (\x -> x /= keyNum) model.keyPressed ) }, Cmd.none )

        MainType.KeyDown keyNum ->
            ( { model | keyPressed = List.append [ keyNum ] model.keyPressed }, Cmd.none )

        MainType.Tick timePassed ->
            let
                ( newModel, cmd ) =
                    ( model, Cmd.none )
                        |> Player.update
                        |> Event.update
                        |> Brick.update

            in
            ( newModel, cmd )

        _ ->
            ( model, Cmd.none )

testUpdate : Int -> Level1Type.Model -> Level1Type.Model
testUpdate times model =
    List.foldl
        (\i tempModel ->
            let
                ( nextTempModel, cmd ) =
                    ( tempModel, Cmd.none )
                        |> Event.update
                        |> Player.update
                        |> Brick.update

            in
            nextTempModel
        )
        model
        (List.range 0 times )
