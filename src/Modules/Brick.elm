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