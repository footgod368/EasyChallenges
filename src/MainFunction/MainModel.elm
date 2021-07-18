module MainFunction.MainModel exposing (Model)

{-| Store MainModel


# Model

@docs Model

-}

import Level0.Level0Type as Level0Type
import Level1.Level1Type as Level1Type
import Level2.Level2Type as Level2Type
import Level3.Level3Type as Level3Type
import Level4.Level4Type as Level4Type
import MainFunction.MainType as MainType
import Menu.MenuType as MenuType


{-| This main model stores level1 Model
-}
type alias Model =
    { mainScene : MainType.MainScene
    , menuModel : MenuType.Model
    , level0Model : Level0Type.Model
    , level1Model : Level1Type.Model
    , level2Model : Level2Type.Model
    , level3Model : Level3Type.Model
    , level4Model : Level4Type.Model
    }
