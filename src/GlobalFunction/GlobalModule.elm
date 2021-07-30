module GlobalFunction.GlobalModule exposing
    ( Visibility(..), Collision(..), Move(..)
    , updateOneVisibility, updateOneCollision, updateOneMove
    )

{-| Define the properties of the module and the functions that handle these properties.


# Properties

@docs Visibility, Collision, Move


# Function

@docs updateOneVisibility, updateOneCollision, updateOneMove

-}

import Array exposing (Array)
import GlobalFunction.GlobalBasics as GlobalBasics
import Maybe exposing (withDefault)
import Modules.Event as Event


{-| `Visibility` describes the visibility of the block. `Visible/Invisible (nextVisibility: Visibility)`:
nextVisibility means what will happen after this visibility. `NoNextVisibility` means no further visibility
change (Caution! Don't put it the first place). `VisibleAfterEvent/InvisibleAfterEvent (eventID: Int) (nextVisibility:
Visibility)`: eventId means in the last visibility, if eventID is activated, the `Visibility` will change
to this current `Visible/Invisible`. Don't put `Visible Visibility` or `Invisible Visibility` in the
following chain, this can only be put at the head. If you want it to be simply be visible, write:

    blockVisibility : Visibility
    blockVisibility =
        Visible NoNextVisibility

For complex things, for example, you want it to be invisible at first, then when `Event` whose id = 1 activates, it
become visible, then finally, when `Event` whose id = 2 activates, it becomes invisible, write:

    blockVisibility : Visibility
    blockVisibility =
        Invisible
            (VisibleAfterEvent 1
                (InvisibleAfterEvent 2 NoNextVisibility)
            )

This is designed delicately and may be quite hard to understand, ask YichenWei if you cannot understand.

-}
type Visibility
    = Visible Visibility
    | Invisible Visibility
    | VisibleAfterEvent Int Visibility
    | InvisibleAfterEvent Int Visibility
    | NoNextVisibility


{-| `Collision` describes if the collision of the block is considered. This is almost the same as
`Visibility`, see details in `Visibility`. Here is just a example. You want it to have no collision at
first, then when `Event` whose id = 1 activates, it has collision, then finally, when `Event` whose id = 2 activates,
it has no collision, write:

    blockCollision : Collision
    blockCollision =
        NoCollide
            (CollideAfterEvent 1
                (NoCollideAfterEvent 2 NoNextCollision)
            )

-}
type Collision
    = Collide Collision
    | NoCollide Collision
    | CollideAfterEvent Int Collision
    | NoCollideAfterEvent Int Collision
    | NoNextCollision


{-| `Move` describes whether and how the will move in the game. `Move (arrayPos : Array Pos) (speed :
Float) (nextMoveEventID : Int) (nextMove : Move)`: arrayPos means the way the block moves, speed is how fast
the block moves each frame, nextMoveEventID is when this stage of movement is finished, what movement happens next,
nextMove is next move, with None indicating no further movements take place. Note, if the first stage is no
movement, then it will move when `Event` whose id = 1 move, write like this, a null array will not make the block move:

    blockMove : Move
    blockMove =
        Move (Array.fromList [])
            0.0
            1
            (Move (Array.fromList [ ( 0.0, 100.0 ), ( 100.0, 100.0 ) ]) 10.0 -1 None)

-}
type Move
    = Move (Array GlobalBasics.Pos) Float Int Move
    | NoNextMove


{-| update visibility. Used in update for individual update. Assume there's actEvent in model while visibility in
module model. Then, you can use it like this.

    type alias Module =
    { visibility : Visibility
    }

    myModule : Module
    myModule =
        Module ( Invisible ( VisibleAfterEvent 2 NoNextVisibility ) )

    type alias Model =
    { actEvent : Array Event.ActEvent
    }

    model : Model
    model =
        Model ( Array.fromList [{id = 2, label = "event2"}] )

    -- updateModule == Module  ( Visible NoNextVisibility ), this is because eventID = 2 is activated
    updateModule : Module
    updateModule =
        updateOneVisibility model myModule

-}
updateOneVisibility : { model | actEvent : Array Event.ActEvent } -> { myModule | visibility : Visibility } -> { myModule | visibility : Visibility }
updateOneVisibility model myModule =
    let
        nextVisibility =
            case myModule.visibility of
                Visible tempNextVisibility ->
                    tempNextVisibility

                Invisible tempNextVisibility ->
                    tempNextVisibility

                _ ->
                    NoNextVisibility

        newVisibility =
            case nextVisibility of
                VisibleAfterEvent eventID nextNextVisibility ->
                    if Event.ifActEventById model eventID == Event.ActEventAct then
                        Visible nextNextVisibility

                    else
                        myModule.visibility

                InvisibleAfterEvent eventID nextNextVisibility ->
                    if Event.ifActEventById model eventID == Event.ActEventAct then
                        Invisible nextNextVisibility

                    else
                        myModule.visibility

                _ ->
                    myModule.visibility

        newModule =
            { myModule | visibility = newVisibility }
    in
    newModule


{-| update collision. Used in update for individual update. Assume there's actEvent in model while collision in
module model. Then, you can use it like this.

    type alias Module =
    { collision : Collision
    }

    myModule : Module
    myModule =
        Module ( NoCollide ( CollideAfterEvent 2 NoNextCollide ) )

    type alias Model =
    { actEvent : Array Event.ActEvent
    }

    model : Model
    model =
        Model ( Array.fromList [{id = 2, label = "event2"}] )

    -- updateModule == Module  ( Collide NoNextCollide ), this is because eventID = 2 is activated
    updateModule : Module
    updateModule =
        updateOneCollision model myModule

-}
updateOneCollision : { model | actEvent : Array Event.ActEvent } -> { myModule | collision : Collision } -> { myModule | collision : Collision }
updateOneCollision model myModule =
    let
        nextCollision =
            case myModule.collision of
                Collide tempNextCollision ->
                    tempNextCollision

                NoCollide tempNextCollision ->
                    tempNextCollision

                _ ->
                    NoNextCollision

        newCollision =
            case nextCollision of
                CollideAfterEvent eventID nextNextCollision ->
                    if Event.ifActEventById model eventID == Event.ActEventAct then
                        Collide nextNextCollision

                    else
                        myModule.collision

                NoCollideAfterEvent eventID nextNextCollision ->
                    if Event.ifActEventById model eventID == Event.ActEventAct then
                        NoCollide nextNextCollision

                    else
                        myModule.collision

                _ ->
                    myModule.collision

        newModule =
            { myModule | collision = newCollision }
    in
    newModule


{-| update move. Used in update for individual update. Assume there's actEvent in model while move in
module model. Then, you can use it like this.

    type alias Module =
    { move : Move
    }

    myModule : Module
    myModule =
        Module ( Move ( Array.fromList [ ( 100.0, 0.0 ) ] 10.0 2 NoNextMove) 

    type alias Model =
    { actEvent : Array Event.ActEvent
    }

    model : Model
    model =
        Model ( Array.fromList [{id = 2, label = "event2"}] )

    -- updateModule == Module NoNextMove, this is because eventID = 2 is activated and module reach the endPoint
    updateModule : Module
    updateModule =
        updateOneMove model myModule

-}
updateOneMove : { model | actEvent : Array Event.ActEvent } -> { myModule | pos : GlobalBasics.Pos, move : Move } -> { myModule | pos : GlobalBasics.Pos, move : Move }
updateOneMove model myModule =
    case myModule.move of
        Move posArray speed eventID nextMove ->
            if Array.isEmpty posArray then
                if Event.ifActEventById model eventID == Event.ActEventAct then
                    { myModule | move = nextMove }

                else
                    myModule

            else
                let
                    destination =
                        withDefault GlobalBasics.defPos (Array.get 0 posArray)
                in
                if GlobalBasics.distPosPos destination myModule.pos <= speed then
                    let
                        newPosArray =
                            Array.slice 1 (Array.length posArray) posArray
                    in
                    { myModule | pos = destination, move = Move newPosArray speed eventID nextMove }

                else
                    let
                        ( destinationX, destinationY ) =
                            destination

                        ( posX, posY ) =
                            myModule.pos

                        newPos =
                            if posX == destinationX then
                                if destinationY > posY then
                                    ( posX, posY + speed )

                                else
                                    ( posX, posY - speed )

                            else
                                let
                                    degree =
                                        atan ((destinationY - posY) / (destinationX - posX))

                                    deltaX =
                                        if destinationX > posX then
                                            abs (speed * cos degree)

                                        else
                                            -(abs (speed * cos degree))

                                    deltaY =
                                        if destinationY > posY then
                                            abs (speed * sin degree)

                                        else
                                            -(abs (speed * sin degree))
                                in
                                ( posX + deltaX, posY + deltaY )
                    in
                    { myModule | pos = newPos }

        NoNextMove ->
            myModule
