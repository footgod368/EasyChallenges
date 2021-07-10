module Brick exposing
    ( BrickVisibility(..), BrickCollision(..), BrickMove(..), BrickAppearance(..), Brick
    , init, quickInit, defBrickCollisionBox
    , view
    , update
    )

{-| The block unit. The most common unit in the game


# Brick

@docs BrickVisibility, BrickCollision, BrickMove, BrickAppearance, Brick


# Brick Constant

@docs brickWidth, brickHeight


# Init

@docs init, quickInit, defBrick, defBrickCollisionBox


# ViewMove

@docs view, viewOneBrick


# Update

@docs update, updateOneBrick, updateOneBrickVisibility, updateOneBrickCollision, updateOneBrickMove

-}

import Array exposing (Array)
import Event
import GlobalBasics
import MainType
import Maybe exposing (withDefault)
import Player
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr
import ViewMove


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


{-| DefaultBrick used with withDefault
-}
defBrick : Brick
defBrick =
    quickInit ( 0, 0 )


{-| initiate a brick, with full functions
-}
init : ( Float, Float ) -> GlobalBasics.CollisionBox -> BrickAppearance -> BrickVisibility -> BrickCollision -> BrickMove -> Brick
init ( x, y ) collisionBox brickAppearance brickVisibility brickCollision brickMove =
    { pos = ( x, y )
    , collisionBox = collisionBox
    , appearance = brickAppearance
    , brickVisibility = brickVisibility
    , brickCollision = brickCollision
    , brickMove = brickMove
    }


{-| default appearance, always visible, have collision, don't move
-}
quickInit : ( Float, Float ) -> Brick
quickInit ( x, y ) =
    { pos = ( x, y )
    , collisionBox = defBrickCollisionBox
    , appearance = NoAppearance
    , brickVisibility = Visible NoNextBrickVisibility
    , brickCollision = Collide NoNextBrickCollision
    , brickMove = NoNextBrickMove
    }


{-| default collisionBox
-}
defBrickCollisionBox : GlobalBasics.CollisionBox
defBrickCollisionBox =
    GlobalBasics.Polygon
        (Array.fromList
            [ ( ( 0.0, 0.0 ), ( brickWidth, 0.0 ) )
            , ( ( brickWidth, 0.0 ), ( brickWidth, brickHeight ) )
            , ( ( brickWidth, brickHeight ), ( 0.0, brickHeight ) )
            , ( ( 0.0, brickHeight ), ( 0.0, 0.0 ) )
            ]
        )


{-| view one brick, used in view, not exposed.
-}
viewOneBrick : { model | windowBoundary : GlobalBasics.Pos, levelBoundary : GlobalBasics.Pos, player : Player.Player } -> Brick -> List (Svg MainType.Msg)
viewOneBrick model brick =
    case brick.brickVisibility of
        Visible nextVisibility ->
            let
                ( brickX, brickY ) =
                    brick.pos
            in
            [ Svg.rect
                [ SvgAttr.x (String.fromFloat (ViewMove.deltaX model + brickX))
                , SvgAttr.y (String.fromFloat (ViewMove.deltaY model + brickY))
                , SvgAttr.width (String.fromFloat brickWidth)
                , SvgAttr.height (String.fromFloat brickHeight)
                , SvgAttr.strokeWidth "2"
                , SvgAttr.stroke "#000000"
                , SvgAttr.fill "#00000050"
                ]
                []
            ]

        Invisible nextVisibility ->
            []

        _ ->
            []


{-| view function of brick
-}
view : { model | bricks : Array Brick, windowBoundary : GlobalBasics.Pos, levelBoundary : GlobalBasics.Pos, player : Player.Player } -> List (Svg MainType.Msg)
view model =
    let
        bricksList =
            Array.toList model.bricks

        svgBrickListList =
            List.map (\brick -> viewOneBrick model brick) bricksList
    in
    List.concat svgBrickListList


{-| update function of brick unit
-}
update : ( { model | player : Player.Player, bricks : Array Brick, actEvent : Array Event.ActEvent }, Cmd MainType.Msg ) -> ( { model | player : Player.Player, bricks : Array Brick, actEvent : Array Event.ActEvent }, Cmd MainType.Msg )
update ( model, cmd ) =
    ( List.foldl updateOneBrick model (List.range 0 (Array.length model.bricks - 1)), cmd )


{-| update one brick. Used in update. Not exposed.
-}
updateOneBrick : Int -> { model | player : Player.Player, bricks : Array Brick, actEvent : Array Event.ActEvent } -> { model | player : Player.Player, bricks : Array Brick, actEvent : Array Event.ActEvent }
updateOneBrick id model =
    model
        |> updateOneBrickVisibility id
        |> updateOneBrickCollision id
        |> updateOneBrickMove id


{-| update brick visibility. Used in update. Not exposed.
-}
updateOneBrickVisibility : Int -> { model | player : Player.Player, bricks : Array Brick, actEvent : Array Event.ActEvent } -> { model | player : Player.Player, bricks : Array Brick, actEvent : Array Event.ActEvent }
updateOneBrickVisibility id model =
    let
        brick =
            Array.get id model.bricks
                |> withDefault defBrick

        nextVisibility =
            case brick.brickVisibility of
                Visible tempNextVisibility ->
                    tempNextVisibility

                Invisible tempNextVisibility ->
                    tempNextVisibility

                _ ->
                    NoNextBrickVisibility

        newBrickVisibility =
            case nextVisibility of
                VisibleAfterEvent eventID nextNextVisibility ->
                    if Event.ifActEventById model eventID == Event.ActEventAct then
                        Visible nextNextVisibility

                    else
                        brick.brickVisibility

                InvisibleAfterEvent eventID nextNextVisibility ->
                    if Event.ifActEventById model eventID == Event.ActEventAct then
                        Invisible nextNextVisibility

                    else
                        brick.brickVisibility

                _ ->
                    brick.brickVisibility

        newBrick =
            { brick | brickVisibility = newBrickVisibility }

        newBricks =
            Array.set id newBrick model.bricks

        newModel =
            { model | bricks = newBricks }
    in
    newModel


{-| update brick collision. Used in update. Not exposed.
-}
updateOneBrickCollision : Int -> { model | player : Player.Player, bricks : Array Brick, actEvent : Array Event.ActEvent } -> { model | player : Player.Player, bricks : Array Brick, actEvent : Array Event.ActEvent }
updateOneBrickCollision id model =
    let
        brick =
            Array.get id model.bricks
                |> withDefault defBrick

        nextCollision =
            case brick.brickCollision of
                Collide tempNextCollision ->
                    tempNextCollision

                NoCollide tempNextCollision ->
                    tempNextCollision

                _ ->
                    NoNextBrickCollision

        newBrickCollision =
            case nextCollision of
                CollideAfterEvent eventID nextNextCollision ->
                    if Event.ifActEventById model eventID == Event.ActEventAct then
                        Collide nextNextCollision

                    else
                        brick.brickCollision

                NoCollideAfterEvent eventID nextNextCollision ->
                    if Event.ifActEventById model eventID == Event.ActEventAct then
                        NoCollide nextNextCollision

                    else
                        brick.brickCollision

                _ ->
                    brick.brickCollision

        newBrick =
            { brick | brickCollision = newBrickCollision }

        newBricks =
            Array.set id newBrick model.bricks

        newBricksModel =
            { model | bricks = newBricks }

        newPlayerModel =
            case newBrickCollision of
                Collide tempNextCollision ->
                    if Player.playerIfCollidePoly newBricksModel brick == GlobalBasics.NotCollided then
                        newBricksModel

                    else
                        case brick.collisionBox of
                            GlobalBasics.Polygon poly ->
                                let
                                    ( ( p1X, p1Y ), ( p2X, p2Y ) ) =
                                        withDefault GlobalBasics.defLineSeg (Array.get 0 poly)

                                    upLS =
                                        ( ( p1X, p1Y ), ( p2X, p2Y ) )

                                    ( playerDownX, playerDownY ) =
                                        GlobalBasics.addPosPos model.player.pos ( 20, 20 )

                                    ( blockUpX, blockUpY ) =
                                        GlobalBasics.addPosPos brick.pos ( 20, 0 )

                                    refreshJumpModel =
                                        if
                                            Player.playerIfCollidePoly
                                                newBricksModel
                                                { pos = brick.pos
                                                , collisionBox = GlobalBasics.Polygon (Array.fromList [ upLS ])
                                                }
                                                == GlobalBasics.Collided
                                                && abs (Tuple.second model.player.velocity) <= 0.2
                                                && abs (playerDownY - blockUpY) <= 0.2
                                        then
                                            Player.playerRefreshJump newBricksModel

                                        else
                                            newBricksModel

                                    collideModel =
                                        Player.playerCollideRigidBody refreshJumpModel brick
                                in
                                collideModel

                _ ->
                    newBricksModel
    in
    newPlayerModel


{-| update brick move event. Used in `updateOneBrick`. Not exposed
-}
updateOneBrickMove : Int -> { model | player : Player.Player, bricks : Array Brick, actEvent : Array Event.ActEvent } -> { model | player : Player.Player, bricks : Array Brick, actEvent : Array Event.ActEvent }
updateOneBrickMove id model =
    let
        brick =
            Array.get id model.bricks
                |> withDefault defBrick
    in
    case brick.brickMove of
        Move posArray speed eventID nextMove ->
            if Array.isEmpty posArray then
                if Event.ifActEventById model eventID == Event.ActEventAct then
                    let
                        newBrick =
                            { brick | brickMove = nextMove }

                        newBricks =
                            Array.set id newBrick model.bricks
                    in
                    { model | bricks = newBricks }

                else
                    model

            else
                let
                    destination =
                        withDefault GlobalBasics.defPos (Array.get 0 posArray)
                in
                if GlobalBasics.distPosPos destination brick.pos <= speed then
                    let
                        newPosArray =
                            Array.slice 1 (Array.length posArray) posArray

                        newBrick =
                            { brick | pos = destination, brickMove = Move newPosArray speed eventID nextMove }

                        newBricks =
                            Array.set id newBrick model.bricks
                    in
                    { model | bricks = newBricks }

                else
                    let
                        ( destinationX, destinationY ) =
                            destination

                        ( posX, posY ) =
                            brick.pos

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

                        newBrick =
                            { brick | pos = newPos }

                        newBricks =
                            Array.set id newBrick model.bricks
                    in
                    { model | bricks = newBricks }

        NoNextBrickMove ->
            model
