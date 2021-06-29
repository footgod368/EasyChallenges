{-| `BrickVisibility` describes the visibility of the block. `Visible/Invisible (nextVisibility: BrickVisibility)`:
nextVisibility means what will happen after this visibility. `NoNextBrickVisibility` means no further visibility
change (Caution! Don't put it the first place). `VisibleAfterEvent/InvisibleAfterEvent (eventID: Int) (nextVisibility:
BrickVisibility)`: eventId means in the last visibility, if eventID is activated, the `BrickVisibility` will change
to this current `Visible/Invisible`. Don't put `Visible BrickVisibility` or `Invisible BrickVisibility` in the
following chain, this can only be put at the head. If you want it to be simply be visible, write:

    blockVisibility : BrickVisibility
    blockVisibility =
        Visible NoNextBrickVisibility

For complex things, for example, you want it to be invisible at first, then when `Event` whose id = 1 activates, it
become visible, then finally, when `Event` whose id = 2 activates, it becomes invisible, write:

    blockVisibility : BrickVisibility
    blockVisibility =
        Invisible
            (VisibleAfterEvent 1
                (InvisibleAfterEvent 2 NoNextBrickVisibility)
            )

This is designed delicately and may be quite hard to understand, ask YichenWei if you cannot understand.

-}
type BrickVisibility
    = Visible BrickVisibility
    | Invisible BrickVisibility
    | VisibleAfterEvent Int BrickVisibility
    | InvisibleAfterEvent Int BrickVisibility
    | NoNextBrickVisibility


{-| `BrickCollision` describes the if the collision of the block is considered. This is almost the same as
`BrickVisibility`, see details in `BrickVisibility`. Here is just a example. You want it to have no collision at
first, then when `Event` whose id = 1 activates, it has collision, then finally, when `Event` whose id = 2 activates,
it has no collision, write:

    blockCollision : BrickCollision
    blockCollision =
        NoCollide
            (CollideAfterEvent 1
                (NoCollideAfterEvent 2 NoNextBrickCollision)
            )

-}
type BrickCollision
    = Collide BrickCollision
    | NoCollide BrickCollision
    | CollideAfterEvent Int BrickCollision
    | NoCollideAfterEvent Int BrickCollision
    | NoNextBrickCollision



{-| `BrickMove` describes whether and how the brick will move in the game. `Move (arrayPos : Array Pos) (speed :
Float) (nextMoveEventID : Int) (nextBrickMove : BrickMove)`: arrayPos means the way the block moves, speed is how fast
the block moves each frame, nextMoveEventID is when this stage of movement is finished, what movement happens next,
nextBrickMove is next move, with None indicating no further movements take place. Note, if the first stage is no
movement, then it will move when `Event` whose id = 1 move, write like this, a null array will not make the block move:

    blockMove : BrickMove
    blockMove =
        Move (Array.fromList [])
            0.0
            1
            (Move (Array.fromList [ ( 0.0, 100.0 ), ( 100.0, 100.0 ) ]) 10.0 -1 None)

-}
type BrickMove
    = Move (Array GlobalBasics.Pos) Float Int BrickMove
    | NoNextBrickMove


{-| For future different shapes of blocks.
-}
type BrickAppearance
    = NoAppearance
    | Grass


{-| brickWidth Constant
-}
brickWidth : Float
brickWidth =
    --30.0
    Tuple.first GlobalBasics.blockSize


{-| brickHeight Constant
-}
brickHeight : Float
brickHeight =
    Tuple.second GlobalBasics.blockSize


{-| `Brick` is a record of the block unit. See detail definitions in individual definition.
-}
type alias Brick =
    { pos : GlobalBasics.Pos
    , collisionBox : GlobalBasics.CollisionBox
    , appearance : BrickAppearance
    , brickVisibility : BrickVisibility
    , brickCollision : BrickCollision
    , brickMove : BrickMove
    }

