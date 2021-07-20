module Modules.Event exposing
    ( ActEvent, IfActEventAct(..), ifActEventById, ifActEventByName, ifActEvent
    , EventInfo, EventIfStartAct(..), EventActType(..), EventActCounter(..), EventDuration, Event
    , init, quickDuration, hitBlock, hitLineSeg, hitLineSegAfter, hitBlockAfter, deleteEventById
    , update
    )

{-| The events that are essential for all other units.


# ActivatedEvent

@docs ActEvent, IfActEventAct, ifActEventById, ifActEventByName, ifActEvent


# Event

@docs EventInfo, EventIfStartAct, EventActType, EventActCounter, EventDuration, Event


# init

@docs init, quickDuration, hitBlock, hitLineSeg, hitLineSegAfter, hitBlockAfter


# update

@docs update

-}

--module Event exposing (..)

import Array exposing (Array)
import GlobalFunction.GlobalBasics as GlobalBasics
import Html.Attributes exposing (height, width)
import MainFunction.MainType as MainType
import Maybe exposing (withDefault)
import Modules.Player as Player


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


{-| `sumActEventById` is a function that helps `ifActEventById`. Takes `Event` id and a `ActEvent`, returns sum + 1 if
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
`Model`. `activateEvent` takes the `Model`, `Event` and returns `Model` with this `Event` activated. You can use it this
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


{-| Start activation type, it can be another event or already started
-}
type EventIfStartAct
    = AfterActEvent Int
    | StartActivated


{-| The activation type for the event, After Int frames or player collide with others.
-}
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


{-| `eventInit` initiates an event. You can use it like this:

    event : Event
    event =
        init { id = 1, name = "Event1" } StartActivated (TimeAfterStart 60) (quickDuration 60)

-}
init : EventInfo -> EventIfStartAct -> EventActType -> EventDuration -> Event
init eventInfo eventIfStartAct eventActType eventDuration =
    Event eventInfo eventIfStartAct eventActType eventDuration EventNotAct


{-| `quickDuration` returns a simple `EventDuration` that only activates once, and lasts for `duration`. You can use
it like this:

    eventDuration : EventDuration
    eventDuration =
        quickDuration 60

-}
quickDuration : Int -> EventDuration
quickDuration duration =
    EventDuration 1 0 duration 0


{-| `defEvent` is used in maybe's withDefault function. Use it directly, noe exposed.
-}
defEvent : Event
defEvent =
    init { id = 0, name = "" } StartActivated (TimeAfterStart 0) (quickDuration 0)


{-| Update all the Events
-}
update : ( { model | actEvent : Array ActEvent, player : Player.Player, event : Array Event }, Cmd MainType.Msg ) -> ( { model | actEvent : Array ActEvent, player : Player.Player, event : Array Event }, Cmd MainType.Msg )
update ( model, cmd ) =
    let
        newModel =
            List.foldl
                (\i tmpModel -> updateOneEvent tmpModel i)
                model
                (List.range 0 (Array.length model.event - 1))
    in
    ( newModel, cmd )


{-| `updateOneEvent` updates one event, used in `update`. Not exposed.
-}
updateOneEvent : { model | actEvent : Array ActEvent, player : Player.Player, event : Array Event } -> Int -> { model | actEvent : Array ActEvent, player : Player.Player, event : Array Event }
updateOneEvent model index =
    let
        event =
            Array.get index model.event
                |> withDefault defEvent
    in
    if event == defEvent then
        model

    else
        let
            ( newModel, newEvent ) =
                updateOneEventActCounter ( model, event )
                    |> updateOneEventIfStartAct

            newEventModel =
                { newModel | event = Array.set index newEvent newModel.event }
        in
        newEventModel


{-| `updateOneEventIfStartAct` updates one event's `ifStartAct`, used in `updateOneEvent`. Not exposed.
-}
updateOneEventIfStartAct : ( { model | actEvent : Array ActEvent, player : Player.Player }, Event ) -> ( { model | actEvent : Array ActEvent, player : Player.Player }, Event )
updateOneEventIfStartAct ( model, event ) =
    case event.ifStartAct of
        AfterActEvent eventId ->
            if ifActEventById model eventId == ActEventAct then
                let
                    newEvent =
                        { event | ifStartAct = StartActivated }
                in
                updateOneEventIfStartAct ( model, newEvent )

            else
                ( model, event )

        StartActivated ->
            updateOneEventActType ( model, event )


{-| `eventUpdateActivateEvent` activates the event. Used in `updateOneEventActType`. Not exposed.
-}
eventUpdateActivateEvent : ( { model | actEvent : Array ActEvent }, Event ) -> ( { model | actEvent : Array ActEvent }, Event )
eventUpdateActivateEvent ( model, event ) =
    let
        newModel =
            activateEvent model event.info

        oldDuration =
            event.duration

        newDuration =
            { oldDuration
                | leftActTimes = oldDuration.leftActTimes - 1
                , nowInterval = oldDuration.nowInterval
            }

        newActCounter =
            EventActTill oldDuration.actDuration

        newEvent =
            { event | duration = newDuration, actCounter = newActCounter }
    in
    ( newModel, newEvent )


{-| `updateOneEventActType` updates one event's `eventActType`, used in `updateOneEvent`. Not exposed.
-}
updateOneEventActType : ( { model | actEvent : Array ActEvent, player : Player.Player }, Event ) -> ( { model | actEvent : Array ActEvent, player : Player.Player }, Event )
updateOneEventActType ( model, event ) =
    if event.duration.leftActTimes == 0 then
        ( model, event )

    else if event.duration.nowInterval /= 0 then
        let
            oldEventDuration =
                event.duration

            newEventDuration =
                { oldEventDuration | nowInterval = oldEventDuration.nowInterval - 1 }

            newEvent =
                { event | duration = newEventDuration }
        in
        ( model, newEvent )

    else
        case event.actType of
            TimeAfterStart timeLeft ->
                if timeLeft == 0 then
                    eventUpdateActivateEvent ( model, event )

                else
                    ( model, { event | actType = TimeAfterStart (timeLeft - 1) } )

            PlayerCollide collisionBox ->
                if Player.playerIfCollidePoly model { pos = ( 0.0, 0.0 ), collisionBox = collisionBox } == GlobalBasics.Collided then
                    eventUpdateActivateEvent ( model, event )

                else
                    ( model, event )


{-| `updateOneEventActType` updates one event's `eventActType`, used in `updateOneEvent`. Not exposed.
-}
updateOneEventActCounter : ( { model | actEvent : Array ActEvent, player : Player.Player }, Event ) -> ( { model | actEvent : Array ActEvent, player : Player.Player }, Event )
updateOneEventActCounter ( model, event ) =
    case event.actCounter of
        EventNotAct ->
            ( model, event )

        EventActTill timeLeft ->
            if timeLeft == 0 then
                let
                    newModel =
                        deactivateEvent model event.info

                    newEvent =
                        { event | actCounter = EventNotAct }
                in
                ( newModel, newEvent )

            else if timeLeft == -1 then
                ( model, event )

            else
                ( model, { event | actCounter = EventActTill (timeLeft - 1) } )


{-| quick functions to create 'Event'
-}
hitBlock : Int -> String -> ( Float, Float ) -> ( Float, Float ) -> Event
hitBlock id_ name_ ( x_, y_ ) ( width_, height_ ) =
    let
        ( x, y ) =
            GlobalBasics.blockPosFloat ( x_, y_ )

        ( width, height ) =
            ( 40 * width_, 40 * height_ )
    in
    init
        { id = id_, name = name_ }
        StartActivated
        (PlayerCollide
            (GlobalBasics.Polygon
                (Array.fromList
                    [ ( ( x, y ), ( x + width, y ) )
                    , ( ( x + width, y ), ( x + width, y + height ) )
                    , ( ( x + width, y + height ), ( x, y + height ) )
                    , ( ( x, y + height ), ( x, y ) )
                    ]
                )
            )
        )
        (quickDuration 10)


{-| The event activated when the player hit a line Segment
-}
hitLineSeg : Int -> String -> ( Float, Float ) -> ( Float, Float ) -> Event
hitLineSeg id_ name_ pos1_ pos2_ =
    init
        { id = id_, name = name_ }
        StartActivated
        (PlayerCollide
            (GlobalBasics.Polygon (Array.fromList [ ( pos1_, pos2_ ) ]))
        )
        (quickDuration 10)
        
{-| Delete an event when another event happens, by ID
-}
deleteEventById : { model | event: Array Event , actEvent : Array ActEvent } -> Int -> Int -> { model | event: Array Event, actEvent : Array ActEvent }
deleteEventById model flagEventId targetEventId =
        if ifActEventById model flagEventId == ActEventAct then
            { model | event = (Array.filter (\e -> e.info.id /= targetEventId) model.event)}
        else
            model
{-| The event activated when the player hit a brick  after a Event is activated
-}
hitBlockAfter : Int -> String -> ( Float, Float ) -> ( Float, Float ) -> Int -> Event
hitBlockAfter id_ name_ ( x_, y_ ) ( width_, height_ ) afterID =
    let
        ( x, y ) =
            GlobalBasics.blockPosFloat ( x_, y_ )

        ( width, height ) =
            ( 40 * width_, 40 * height_ )
    in
    init
        { id = id_, name = name_ }
        (AfterActEvent afterID)
        (PlayerCollide
            (GlobalBasics.Polygon
                (Array.fromList
                    [ ( ( x, y ), ( x + width, y ) )
                    , ( ( x + width, y ), ( x + width, y + height ) )
                    , ( ( x + width, y + height ), ( x, y + height ) )
                    , ( ( x, y + height ), ( x, y ) )
                    ]
                )
            )
        )
        (quickDuration 10)

{-| The event activated when the player hit a line Segment after a Event is activated
-}
hitLineSegAfter : Int -> String -> ( Float, Float ) -> ( Float, Float ) -> Int -> Event
hitLineSegAfter id_ name_ pos1_ pos2_ afterID =
    init
        { id = id_, name = name_ }
        (AfterActEvent afterID)
        (PlayerCollide
            (GlobalBasics.Polygon (Array.fromList [ ( pos1_, pos2_ ) ]))
        )
        (quickDuration 10)
