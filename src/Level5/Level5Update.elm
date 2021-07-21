module Level5.Level5Update exposing (update)

{-| update Level5


# update

@docs update

-}

import Array exposing (Array)
import Level5.Level5Init as Level5Init
import Level5.Level5Type as Level5Type
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


{-| `update` of Level5
-}
update : MainType.Msg -> Level5Type.Model -> ( Level5Type.Model, Cmd MainType.Msg )
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
                            |> checkBlueOrRed
                            |> checkBlue
                            |> checkRed
                            |> checkBlueAndRed

                    else
                        ( model, Cmd.none )
            in
            if List.member 82 newModel.keyPressed then
                SavePoint.updateReset Level5Init.init ( model, Cmd.none )

            else
                ( newModel, cmd )

        buttonMsg ->
            GameControl.update buttonMsg ( model, Cmd.none )


{-| judge whether one event is active now. used in 'count'
-}
countone : Int -> Level5Type.Model -> Level5Type.Model
countone id model =
    if Event.ifActEventById model id == Event.ActEventAct && not (List.member id model.number) then
        let
            num =
                model.number
        in
        { model | number = num ++ [ id ] }

    else
        model


{-| update the 'number' field in model, to record what events have been activated
-}
count : ( Level5Type.Model, Cmd MainType.Msg ) -> ( Level5Type.Model, Cmd MainType.Msg )
count ( model, cmd ) =
    let
        newmodel =
            List.foldl countone model (List.range 1 14)
    in
    ( newmodel, cmd )


{-| check whether player gets blue or red pill and kill them if so
-}
checkBlueOrRed : ( Level5Type.Model, Cmd MainType.Msg ) -> ( Level5Type.Model, Cmd MainType.Msg )
checkBlueOrRed ( model, cmd ) =
    if Event.ifActEventById model 6 == Event.ActEventAct || Event.ifActEventById model 7 == Event.ActEventAct then
        ( Player.playerKill model, cmd )

    else
        ( model, cmd )


notId : Int -> Event.Event -> Bool
notId id event =
    event.info.id /= id


{-| if player hits the blue '?' again, he won't die if reach previous blue block
-}
checkBlue : ( Level5Type.Model, Cmd MainType.Msg ) -> ( Level5Type.Model, Cmd MainType.Msg )
checkBlue ( model, cmd ) =
    if List.member 11 model.number then
        let
            oldEvent =
                model.event

            newEvent =
                Array.filter (notId 6) oldEvent
        in
        ( { model | event = newEvent }, cmd )

    else
        ( model, cmd )


{-| if player hits the red '?' again, he won't die if reach previous blue block
-}
checkRed : ( Level5Type.Model, Cmd MainType.Msg ) -> ( Level5Type.Model, Cmd MainType.Msg )
checkRed ( model, cmd ) =
    if List.member 12 model.number then
        let
            oldEvent =
                model.event

            newEvent =
                Array.filter (notId 7) oldEvent
        in
        ( { model | event = newEvent }, cmd )

    else
        ( model, cmd )


notBlueOrRed : Brick.Brick -> Bool
notBlueOrRed brick =
    case brick.appearance of
        Brick.NormalAppearance ->
            True

        Brick.Detailed _ _ color ->
            color /= "#1E90FF" && color /= "#FF0000"


{-| delete the blue and red bricks from model when they have mixed into green
-}
checkBlueAndRed : ( Level5Type.Model, Cmd MainType.Msg ) -> ( Level5Type.Model, Cmd MainType.Msg )
checkBlueAndRed ( model, cmd ) =
    if List.member 14 model.number then
        let
            oldBricks =
                model.bricks

            newBricks =
                Array.filter notBlueOrRed oldBricks
        in
        ( { model | bricks = newBricks }, cmd )

    else
        ( model, cmd )
