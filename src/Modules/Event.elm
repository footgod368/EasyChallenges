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



{-| `ifActEventById` returns whether a event with a given id is activated. Normally, in all levels, there should be a
`Array ActEvent` type value `actEvent` in their `Model`. The input is simply the `Model` and `id` of the`Event`. You can
use it this way (with example model):

    type alias EgModel =
        { actEvent : Array ActEvent
        }

    egModel : EgModel
    egModel =
        EgModel
            (Array.fromList [ ActEvent 2 "Event2", ActEvent 4 "Event4" ])

    -- result1 == Activated
    result1 =
        ifActEventById egModel 4

    -- result2 == NotActivated
    result2 =
        ifActEventById egModel 3

-}
ifActEventById : { model | actEvent : Array ActEvent } -> Int -> IfActEventAct
ifActEventById model id =
    if Array.foldl (sumActEventById id) 0 model.actEvent == 0 then
        ActEventNotAct

    else
        ActEventAct


{-| `sumActEventByName` is a function that helps `ifActEventById`. Take `id` of `Event` and a `ActEvent`, returns
sum + 1 if `id` of `Event` matched `id` of `ActEvent`
-}
sumActEventByName : String -> ActEvent -> Int -> Int
sumActEventByName name actEvent sum =
    if actEvent.name == name then
        sum + 1

    else
        sum


{-| `ifActEventByName` returns whether a event with a given `name` is activated. Normally, in all levels, there should
be a `Array ActEvent` type value `actEvent`in their `Model`. The input is simply the `Model` and `name` of the `Event`.
You can use it this way (with example model):

    type alias EgModel =
        { actEvent : Array ActEvent
        }

    egModel : EgModel
    egModel =
        EgModel
            (Array.fromList [ ActEvent 2 "Event2", ActEvent 4 "Event4" ])

    -- result1 == Activated
    result1 =
        ifActEventByName egModel "Event4"

    -- result2 == NotActivated
    result2 =
        ifActEventByName egModel "Event3"

-}
ifActEventByName : { model | actEvent : Array ActEvent } -> String -> IfActEventAct
ifActEventByName model name =
    if Array.foldl (sumActEventByName name) 0 model.actEvent == 0 then
        ActEventNotAct

    else
        ActEventAct


{-| `sumActEvent` is a function that helps `ifActEvent`. Take `EventInfo` and a `ActEvent`, returns
sum + 1 if `EventInfo` matches `ActEvent`. Not exposed.
-}
sumActEvent : EventInfo -> ActEvent -> Int -> Int
sumActEvent eventInfo actEvent sum =
    if actEvent.name == eventInfo.name && actEvent.id == eventInfo.id then
        sum + 1

    else
        sum


{-| `ifActEvent` returns whether a event with a given `EventInfo` is activated. Normally, in all levels, there should
be a `Array ActEvent` type value `actEvent`in their `Model`. The input is simply the `Model` and `EventInfo` of the
`Event`. You can use it this way (with example model):

    type alias EgModel =
        { actEvent : Array ActEvent
        }

    egModel : EgModel
    egModel =
        EgModel
            (Array.fromList [ ActEvent 2 "Event2", ActEvent 4 "Event4" ])

    -- result1 == Activated
    result1 =
        ifActEvent egModel { id = 4, name = "Event4" }

    -- result2 == NotActivated
    result2 =
        ifActEvent egModel { id = 3, name = "Event3" }

-}
ifActEvent : { model | actEvent : Array ActEvent } -> EventInfo -> IfActEventAct
ifActEvent model eventInfo =
    if Array.foldl (sumActEvent eventInfo) 0 model.actEvent == 0 then
        ActEventNotAct

    else
        ActEventAct


{-| `activateEvent` activates a event. Normally, in all levels, there should be a `Array ActEvent` value `actEvent` in
`Model`. `activeEvent` takes the `Model`, `Event` and returns `Model` with this `Event` activated. You can use it this
way:

    type alias EgModel =
        { actEvent : Array ActEvent
        }

    egModel : EgModel
    egModel =
        EgModel
            (Array.fromList
                [ ActEvent 2 "Event2"
                , ActEvent 4 "Event4"
                ]
            )

    --event == { id = 3, name = "Event3" }
    event : Event

    --egModel2 == { actEvent = Array.fromList [{ id = 2, name = "Event2" },{ id = 4, name = "Event4" },{ id = 3, name = "Event3" }] }
    egModel2 : EgModel
    egModel2 =
        activateEvent egModel Event

-}