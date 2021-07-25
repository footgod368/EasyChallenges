module MainFunction.MainModel exposing (Model)

{-| Store MainModel


# Model

@docs Model

-}

import Level7.Level7Type as Level7Type
import Level1.Level1Type as Level1Type
import Level2.Level2Type as Level2Type
import Level3.Level3Type as Level3Type
import Level4.Level4Type as Level4Type
import Level5.Level5Type as Level5Type
import Level6.Level6Type as Level6Type
import MainFunction.MainType as MainType
import Menu.MenuType as MenuType


{-| This main model stores level1 Model
-}
type alias Model =
    { mainScene : MainType.MainScene
    , menuModel : MenuType.Model
    , level7Model : Level7Type.Model
    , level1Model : Level1Type.Model
    , level2Model : Level2Type.Model
    , level3Model : Level3Type.Model
    , level4Model : Level4Type.Model
    , level6Model : Level6Type.Model
    , level5Model : Level5Type.Model
    }
