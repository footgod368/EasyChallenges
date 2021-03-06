module MainFunction.MainView exposing (view)

{-| Main view function


# view

@docs view

-}

import Html exposing (Html)
import Level1.Level1View as Level1View
import Level2.Level2View as Level2View
import Level3.Level3View as Level3View
import Level4.Level4View as Level4View
import Level5.Level5View as Level5View
import Level6.Level6View as Level6View
import MainFunction.MainModel as MainModel
import MainFunction.MainType as MainType
import Menu.MenuView as MenuView


{-| View according to Model, will view each level.
-}
view : MainModel.Model -> Html MainType.Msg
view model =
    case model.mainScene of
        MainType.Menu ->
            MenuView.view model.menuModel

        MainType.Level1 ->
            Level1View.view model.level1Model

        MainType.Level2 ->
            Level2View.view model.level2Model

        MainType.Level3 ->
            Level3View.view model.level3Model

        MainType.Level4 ->
            Level4View.view model.level4Model

        MainType.Level6 ->
            Level6View.view model.level6Model

        MainType.Level5 ->
            Level5View.view model.level5Model
