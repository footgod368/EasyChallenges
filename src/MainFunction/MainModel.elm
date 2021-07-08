module MainModel exposing (Model)

{-| Store MainModel


# Model

@docs Model

-}

import Level1Type
import MainType


{-| This main model stores level1 Model
-}
type alias Model =
    { scene : MainType.MainScene
    , level1Model : Level1Type.Model
    }
