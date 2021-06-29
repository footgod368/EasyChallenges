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
activateEvent : { model | actEvent : Array ActEvent } -> ActEvent -> { model | actEvent : Array ActEvent }
activateEvent model event =
    let
        actEvent =
            ActEvent event.id event.name

        newActEvent =
            if List.member event (Array.toList model.actEvent) then
                model.actEvent

            else
                Array.push actEvent model.actEvent

        newModel =
            { model | actEvent = newActEvent }
    in
    newModel


{-| `deactivateEventById` deactivates a event by `id`. Normally, in all levels, there should be a `Array ActEvent` value
`actEvent` in `Model`. `deactivateEventById` takes the `Model` and `id` of `Event` and returns `Model` with this `Event`
deactivated. Note: if not found this `Event` in `actEvent`, it will be ignored and doesn't send error. You can use it
like this:

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

    --egModel2 == { actEvent = Array.fromList [{ id = 4, name = "Event4" }] }
    egModel2 : EgModel
    egModel2 =
        deactivateEventById egModel 2

-}
deactivateEventById : { model | actEvent : Array ActEvent } -> Int -> { model | actEvent : Array ActEvent }
deactivateEventById model id =
    let
        newActEvent =
            Array.filter (\actEvent -> actEvent.id /= id) model.actEvent

        newModel =
            { model | actEvent = newActEvent }
    in
    newModel


{-| `deactivateEventByName` deactivates a event by `name`. Normally, in all levels, there should be a `Array ActEvent`
value `actEvent` in `Model`. `deactivateEventByName` takes the `Model` and `name` of `Event` and returns `Model` with
this `Event` deactivated. Note: if not found this `Event` in `actEvent`, it will be ignored and doesn't send error. You
can use it like this:

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

    --egModel2 == { actEvent = Array.fromList [{ id = 4, name = "Event4" }] }
    egModel2 : EgModel
    egModel2 =
        deactivateEventById egModel 2

-}
deactivateEventByName : { model | actEvent : Array ActEvent } -> String -> { model | actEvent : Array ActEvent }
deactivateEventByName model name =
    let
        newActEvent =
            Array.filter (\actEvent -> actEvent.name /= name) model.actEvent

        newModel =
            { model | actEvent = newActEvent }
    in
    newModel


{-| `deactivateEvent` deactivates a event by `name` and `id`. Only deactivates when both of them matches, really
similar to `deactivateEventByName` and `deactivateEventById`. You can use it like this:

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

    --egModel2 == { actEvent = Array.fromList [{ id = 4, name = "Event4" }] }
    egModel2 : EgModel
    egModel2 =
        deactivateEvent egModel { id = 2, name = "Event2" }

-}
deactivateEvent : { model | actEvent : Array ActEvent } -> { event | id : Int, name : String } -> { model | actEvent : Array ActEvent }
deactivateEvent model event =
    let
        newActEvent =
            Array.filter (\actEvent -> event.name /= actEvent.name && event.name /= actEvent.name) model.actEvent

        newModel =
            { model | actEvent = newActEvent }
    in
    newModel


{-| `EventInfo` is a record that stores the basic information (id and name) of a event. Used in all places that use
events
-}
type alias EventInfo =
    { id : Int
    , name : String
    }


type EventIfStartAct
    = AfterActEvent EventInfo
    | StartActivated


type EventActType
    = TimeAfterStart Int
    | PlayerCollide GlobalBasics.CollisionBox


{-| `EventActivatedCounter` is a type that records the current event activation status. `NotActivated` means not
activated. `ActivatedTill (tillNum: Int)` means after `tillNum` frames, the `Event` will be deactivated.
-}
type EventActCounter
    = EventNotAct
    | EventActTill Int


{-| `EventDuration` is a record that stores event activation status. `leftActTimes` means the left times the event
can be activated, -1 means infinitely. `actInterval` means after a activation, how many frames will the next activation
not activated though fits the activation pending. `actDuration` means how many frames will this `Event` be activated,
-1 means infinitely. `nowInterval` should be initialized with 0, it means until when will this `EventDuration` be
activated again.
-}
type alias EventDuration =
    { leftActTimes : Int
    , actInterval : Int
    , actDuration : Int
    , nowInterval : Int
    }


{-| `Event` is a record that stores the core unit: event. See individual type for details.
-}
type alias Event =
    { info : EventInfo
    , ifStartAct : EventIfStartAct
    , actType : EventActType
    , duration : EventDuration
    , actCounter : EventActCounter
    }

