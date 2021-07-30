module Menu.MenuUpdate exposing (update)

{-| Update function for the Menu


# update

@docs update

-}

import Array
import MainFunction.MainConstant as MainConstant
import MainFunction.MainType as MainType exposing (Msg(..))
import Menu.MenuType as MenuType


{-| Handles update `Resize` and `GetViewPort` Message. Sub functions handles player control(keyboard) input, and player
control on buttons.
-}
update : MainType.Msg -> ( MenuType.Model, Cmd MainType.Msg ) -> ( MenuType.Model, Cmd MainType.Msg )
update msg ( model, cmd ) =
    case msg of
        MainType.Resize width height ->
            ( { model | windowBoundary = ( toFloat width * 0.95, toFloat height * 0.95 ) }, Cmd.none )

        MainType.GetViewport viewport ->
            ( { model | windowBoundary = ( viewport.viewport.width * 0.95, viewport.viewport.height * 0.95 ) }, Cmd.none )

        _ ->
            ( model, cmd )
                |> updateButton msg
                |> updateControl msg


{-| handles player control(keyboard) input
-}
updateControl : MainType.Msg -> ( MenuType.Model, Cmd MainType.Msg ) -> ( MenuType.Model, Cmd MainType.Msg )
updateControl msg ( model, cmd ) =
    let
        oldKeyPressed =
            model.keyPressed

        newKeyModel =
            case msg of
                KeyUp keyNum ->
                    { model | keyPressed = List.filter (\i -> i /= keyNum) oldKeyPressed }

                KeyDown keyNum ->
                    { model | keyPressed = List.append [ keyNum ] oldKeyPressed }

                _ ->
                    model

        ( newModel, newCmd ) =
            --if List.member 49 newKeyMenuType.Model.keyPressed then
            --    ( { newKeyMenuType.Model | mainStatus = Level1 }, Cmd.batch [ cmd ] )
            --
            --else if List.member 50 newKeyMenuType.Model.keyPressed then
            --    ( { newKeyMenuType.Model | mainStatus = Level2 }, Cmd.batch [ cmd ] )
            --
            --else if List.member 51 newKeyMenuType.Model.keyPressed then
            --    ( { newKeyMenuType.Model | mainStatus = Level3 }, Cmd.batch [ cmd ] )
            --
            --else
            ( newKeyModel, Cmd.batch [ cmd ] )
    in
    ( newModel, newCmd )


{-| handles player control(button events) input
-}
updateButton : MainType.Msg -> ( MenuType.Model, Cmd MainType.Msg ) -> ( MenuType.Model, Cmd MainType.Msg )
updateButton msg ( model, cmd ) =
    case msg of
        OnMouseOver num ->
            ( { model | buttonState = Array.set num MainConstant.buttonOverColor model.buttonState }
            , Cmd.batch [ cmd ]
              --, cmd
            )

        OnMouseOut num ->
            ( { model | buttonState = Array.set num MainConstant.buttonNormalColor model.buttonState }
            , Cmd.batch [ cmd ]
              --, cmd
            )

        OnMouseDown num ->
            ( { model | buttonState = Array.set num MainConstant.buttonDownColor model.buttonState }
            , Cmd.batch [ cmd ]
              --, cmd
            )

        OnMouseUp num ->
            let
                ( newModel, newCmd ) =
                    --if joinRoomButtonStartId <= num && num <= joinRoomButtonEndId then
                    --    ( model, Cmd.batch [ cmd, consoleLog "joinRoom",  clientSend ("joinRoom " ++ String.fromInt (num - joinRoomButtonStartId)) ] )
                    --
                    --else
                    case num of
                        1 ->
                            --menuButtonLevel1
                            ( { model | mainStatus = MainType.Level1 }, Cmd.batch [ cmd ] )

                        2 ->
                            --menuButtonLevel2
                            ( { model | mainStatus = MainType.Level2 }, Cmd.batch [ cmd ] )

                        3 ->
                            --menuButtonLevel3
                            ( { model | mainStatus = MainType.Level3 }, Cmd.batch [ cmd ] )

                        4 ->
                            --menuButtonLevel4
                            ( { model | mainStatus = MainType.Level4 }, Cmd.batch [ cmd ] )

                        6 ->
                            --menuButtonLevel6
                            ( { model | mainStatus = MainType.Level6 }, Cmd.batch [ cmd ] )

                        5 ->
                            --menuButtonLevel5
                            ( { model | mainStatus = MainType.Level5 }, Cmd.batch [ cmd ] )

                        _ ->
                            ( model, Cmd.batch [ cmd ] )
            in
            ( { newModel | buttonState = Array.set num MainConstant.buttonNormalColor newModel.buttonState }
            , Cmd.batch [ newCmd ]
            )

        _ ->
            ( model, cmd )
