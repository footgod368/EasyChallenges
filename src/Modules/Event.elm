import Array exposing (Array)
import GlobalBasics
import MainType
import Maybe exposing (withDefault)
import Player


{-| `ActEvent` is type used in `Model`, storing all the activated `Events`. For
example:

    type alias EgModel =
        { actEvent : Array ActEvent
        }

`id` is its id, a way to find it. `id` represents the Array id of specific `Event` type in `Model`. `name` is its name
, another way to find it. Every update, all `Events` will be updated and `Events` that are activated will be added to
`actEvent`, while `Events` that are deactivated will be deleted from `actEvent`. The way to find whether a `Events` is
activated can be through id or name, which is `ifActEventByID` and `ifActEventByName`

-}
type alias ActEvent =
    { id : Int
    , name : String
    }


{-| `IfActivated` is type that is return value of `ifActEventById` and `ifActEventByName`. `Activated` means activated
and vise versa.
-}
type IfActEventAct
    = ActEventAct
    | ActEventNotAct


{-| `sumActEventById` is a function that helps `ifActEventById`. Tasks `Event` id and a `ActEvent`, returns sum + 1 if
`id` of `Event` matched `ActEvent`
-}
sumActEventById : Int -> ActEvent -> Int -> Int
sumActEventById id actEvent sum =
    if actEvent.id == id then
        sum + 1

    else
        sum