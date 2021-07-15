module MainModel exposing (Model)

{-| Store MainModel


# Model

@docs Model

-}

import Level0Type
import Level1Type
import Level2Type
import MainType
import MenuType


{-| This main model stores level1 Model
-}
type alias Model =
    { scene : MainType.MainScene
    , menuModel : MenuType.Model
    , level0Model : Level0Type.Model
    , level1Model : Level1Type.Model
    , level2Model : Level2Type.Model
    }
