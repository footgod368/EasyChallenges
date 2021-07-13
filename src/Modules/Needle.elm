module Needle exposing (..)

type BrickVisibility
    = Visible BrickVisibility
    | Invisible BrickVisibility
    | VisibleAfterEvent Int BrickVisibility
    | InvisibleAfterEvent Int BrickVisibility
    | NoNextBrickVisibility

type BrickCollision
    = Collide BrickCollision
    | NoCollide BrickCollision
    | CollideAfterEvent Int BrickCollision
    | NoCollideAfterEvent Int BrickCollision
    | NoNextBrickCollision

type BrickMove
    = Move (Array GlobalBasics.Pos) Float Int BrickMove
    | NoNextBrickMove

type BrickAppearance
    = NoAppearance
    | Grass