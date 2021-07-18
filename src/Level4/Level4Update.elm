module Level4.Level4Update exposing (update)

{-| update Level4


# update

@docs update

-}

import Array exposing (Array)
import Level4.Level4Init as Level4Init
import Level4.Level4Type as Level4Type
import MainFunction.MainType as MainType
import Modules.Boundary as Boundary
import Modules.Brick as Brick
import Modules.EndPoint as EndPoint
import Modules.Event as Event exposing (Event)
import Modules.GameControl as GameControl
import Modules.Needle as Needle
import Modules.NoticeBoard as NoticeBoard
import Modules.Player as Player exposing (Player)
import Modules.SavePoint as SavePoint


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
                            |> count
                            |> checkHelmet
                            |> checkWin

                    else
                        ( model, Cmd.none )
            in
            if List.member 82 newModel.keyPressed then
                SavePoint.updateReset Level4Init.init ( model, Cmd.none )

            else
                ( newModel, cmd )

        buttonMsg ->
            GameControl.update buttonMsg ( model, Cmd.none )


countone : Int -> Level4Type.Model -> Level4Type.Model
countone id model =
    if Event.ifActEventById model id == Event.ActEventAct then
        let
            num =
                model.number
        in
        { model | number = num ++ [ id ] }

    else
        model


count : ( Level4Type.Model, Cmd MainType.Msg ) -> ( Level4Type.Model, Cmd MainType.Msg )
count ( model, cmd ) =
    let
        newmodel =
            List.foldl countone model (List.range 1 10)
    in
    ( newmodel, cmd )


notId : Int -> Event.Event -> Bool
notId id event =
    event.info.id /= id


checkHelmet : ( Level4Type.Model, Cmd MainType.Msg ) -> ( Level4Type.Model, Cmd MainType.Msg )
checkHelmet ( model, cmd ) =
    if List.member 9 model.number then
        let
            oldEvent =
                model.event

            newEvent =
                Array.filter (notId 10) oldEvent
        in
        ( { model | event = newEvent }, cmd )

    else
        ( model, cmd )


checkWin : ( Level4Type.Model, Cmd MainType.Msg ) -> ( Level4Type.Model, Cmd MainType.Msg )
checkWin ( model, cmd ) =
    if
        List.member 1 model.number
            && List.member 2 model.number
            && List.member 3 model.number
            && List.member 4 model.number
            && List.member 5 model.number
            && List.member 6 model.number
            && List.member 7 model.number
            && List.member 8 model.number
            && not (List.member 10 model.number)
    then
        ( Player.playerWin model, cmd )

    else
        ( model, cmd )
