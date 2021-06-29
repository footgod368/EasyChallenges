module MainInit exposing (init)

{-| The init of MainModel.


# init

@docs init

-}

import Level1Init
import MainType
import MainModel

{-| The `init` of MainModel.
-}
init : () -> ( MainModel.Model, Cmd msg )
init a =
    ( MainModel.Model
        MainType.Level1
        Level1Init.init
    , Cmd.none
    )
