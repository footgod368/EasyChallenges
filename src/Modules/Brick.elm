module Modules.Brick exposing
    ( BrickAppearance(..), Brick
    , init, brickCollisionBox, initPos, initFallingBrick, initFallingRow, initNoCollideHidden, initCollideHidden, initRow
    , quickCollisionBox, initPosVolumeColor, initCollideHiddenRow, quickTunnel
    , view
    , update
    )

{-| The block unit. The most common unit in the game


# Brick

@docs BrickAppearance, Brick


# Init

@docs init, brickCollisionBox, initPos, initFallingRow, initNoCollideHidden, initCollideHidden, initRow
@docs quickCollisionBox, initPosVolumeColor, initCollideHiddenRow, quickTunnel


# ViewMove

@docs view


# Update

@docs update

-}

import Array exposing (Array)
import GlobalFunction.GlobalBasics as GlobalBasics
import GlobalFunction.GlobalModule as GlobalModule
import MainFunction.MainType as MainType
import Maybe exposing (withDefault)
import Modules.Event as Event
import Modules.Player as Player
import Modules.ViewMove as ViewMove
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr


{-| For future different appearance of blocks.
-}
type BrickAppearance
    = NormalAppearance --standard brick
    | Detailed Float Float String --with designable size and color


{-| brickWidth Constant
-}
brickWidth : Float
brickWidth =
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
    , visibility : GlobalModule.Visibility
    , collision : GlobalModule.Collision
    , move : GlobalModule.Move
    }


{-| DefaultBrick used with withDefault
-}
defBrick : Brick
defBrick =
    initPos ( 0, 0 )


{-| initiate a brick, with full functions
-}
init : ( Float, Float ) -> BrickAppearance -> GlobalModule.Visibility -> GlobalModule.Collision -> GlobalModule.Move -> Brick
init ( x, y ) brickAppearance visibility brickCollision brickMove =
    { pos = ( x, y )
    , collisionBox = brickCollisionBox brickAppearance
    , appearance = brickAppearance
    , visibility = visibility
    , collision = brickCollision
    , move = brickMove
    }


{-| default appearance, always visible, have collision, don't move
-}
initPos : ( Float, Float ) -> Brick
initPos ( x, y ) =
    { pos = ( x, y )
    , collisionBox = brickCollisionBox NormalAppearance
    , appearance = NormalAppearance
    , visibility = GlobalModule.Visible GlobalModule.NoNextVisibility
    , collision = GlobalModule.Collide GlobalModule.NoNextCollision
    , move = GlobalModule.NoNextMove
    }


{-| another version of 'quickInit'. can be used to create bricks with 'Detailed' appearance type.
-}
initPosVolumeColor : ( Float, Float ) -> ( Float, Float ) -> String -> Brick
initPosVolumeColor ( x, y ) ( width, height ) color =
    { pos = ( x, y )
    , collisionBox = brickCollisionBox (Detailed width height color)
    , appearance = Detailed width height color
    , visibility = GlobalModule.Visible GlobalModule.NoNextVisibility
    , collision = GlobalModule.Collide GlobalModule.NoNextCollision
    , move = GlobalModule.NoNextMove
    }


{-| A brick with a tunnel's appearance
-}
quickTunnel : ( Float, Float ) -> Brick
quickTunnel pos =
    initPosVolumeColor (GlobalBasics.blockPosFloat pos) ( 2 * 40, 3.5 * 40 ) "#008000"


{-| quick function to create a row of bricks by providing 'row index' n, 'starting point' x, 'ending point' y.
-}
initRow : Int -> Int -> Int -> List Brick
initRow n x y =
    List.map (\i -> initPos (GlobalBasics.blockPos ( i, n ))) (List.range x y)


{-| quick function to create one 'falling brick' by providing 'positon' of the brick and 'id' of trigger envent.
-}
initFallingBrick : ( Float, Float ) -> Int -> Brick
initFallingBrick ( x, y ) id =
    { pos = ( x, y )
    , collisionBox = brickCollisionBox NormalAppearance
    , appearance = NormalAppearance
    , visibility = GlobalModule.Visible GlobalModule.NoNextVisibility
    , collision = GlobalModule.Collide GlobalModule.NoNextCollision
    , move =
        GlobalModule.Move
            (Array.fromList [])
            0.0
            id
            (GlobalModule.Move
                (Array.fromList
                    [ ( x, 700.0 )
                    ]
                )
                5.0
                -1
                GlobalModule.NoNextMove
            )
    }


{-| quick function to create a row of 'falling bricks' by providing 'row index' n, 'starting point' x, 'ending point' y.
-}
initFallingRow : Int -> Int -> Int -> Int -> List Brick
initFallingRow n x y id =
    List.map (\i -> initFallingBrick (GlobalBasics.blockPos ( i, n )) id) (List.range x y)


{-| quick function to create one 'hidden brick' which is initially invisible but always collidable.
-}
initNoCollideHidden : ( Float, Float ) -> Int -> Brick
initNoCollideHidden ( x, y ) id =
    { pos = GlobalBasics.blockPosFloat ( x, y )
    , collisionBox = brickCollisionBox NormalAppearance
    , appearance = NormalAppearance
    , visibility = GlobalModule.Invisible (GlobalModule.VisibleAfterEvent id GlobalModule.NoNextVisibility)
    , collision = GlobalModule.Collide GlobalModule.NoNextCollision
    , move = GlobalModule.NoNextMove
    }


{-| quick function to create one 'hidden brick' which is initially invisible and initially non-collidable.
-}
initCollideHidden : ( Float, Float ) -> Int -> Brick
initCollideHidden ( x, y ) id =
    { pos = GlobalBasics.blockPosFloat ( x, y )
    , collisionBox = brickCollisionBox NormalAppearance
    , appearance = NormalAppearance
    , visibility = GlobalModule.Invisible (GlobalModule.VisibleAfterEvent id GlobalModule.NoNextVisibility)
    , collision = GlobalModule.NoCollide (GlobalModule.CollideAfterEvent id GlobalModule.NoNextCollision)
    , move = GlobalModule.NoNextMove
    }


{-| A row of hidden block, used `initCollideHidden` function.
-}
initCollideHiddenRow : Int -> Int -> Int -> Int -> List Brick
initCollideHiddenRow n x y id =
    List.map (\i -> initCollideHidden ( toFloat i, toFloat n ) id) (List.range x y)


{-| default collisionBox
-}
brickCollisionBox : BrickAppearance -> GlobalBasics.CollisionBox
brickCollisionBox brickAppearance =
    case brickAppearance of
        NormalAppearance ->
            GlobalBasics.Polygon
                (Array.fromList
                    [ ( ( 0.0, 0.0 ), ( brickWidth, 0.0 ) )
                    , ( ( brickWidth, 0.0 ), ( brickWidth, brickHeight ) )
                    , ( ( brickWidth, brickHeight ), ( 0.0, brickHeight ) )
                    , ( ( 0.0, brickHeight ), ( 0.0, 0.0 ) )
                    ]
                )

        Detailed width height _ ->
            GlobalBasics.Polygon
                (Array.fromList
                    [ ( ( 0.0, 0.0 ), ( width, 0.0 ) )
                    , ( ( width, 0.0 ), ( width, height ) )
                    , ( ( width, height ), ( 0.0, height ) )
                    , ( ( 0.0, height ), ( 0.0, 0.0 ) )
                    ]
                )


{-| quick function to yield the 'collisionBox' of a brick given the position
-}
quickCollisionBox : ( Float, Float ) -> BrickAppearance -> GlobalBasics.CollisionBox
quickCollisionBox ( x, y ) brickAppearance =
    case brickCollisionBox brickAppearance of
        GlobalBasics.Polygon poly ->
            GlobalBasics.Polygon (GlobalBasics.addPolyPos poly (GlobalBasics.blockPosFloat ( x, y )))


{-| view one brick, used in view, not exposed.
-}
viewOneBrick : { model | windowBoundary : GlobalBasics.Pos, levelBoundary : GlobalBasics.Pos, player : Player.Player } -> Brick -> List (Svg MainType.Msg)
viewOneBrick model brick =
    case brick.visibility of
        GlobalModule.Visible _ ->
            let
                ( brickX, brickY ) =
                    brick.pos
            in
            [ Svg.rect
                (List.append
                    [ SvgAttr.x (String.fromFloat (ViewMove.deltaX model + brickX))
                    , SvgAttr.y (String.fromFloat (ViewMove.deltaY model + brickY))
                    , SvgAttr.strokeWidth "2"
                    , SvgAttr.stroke "#000000"
                    , case brick.appearance of
                        NormalAppearance ->
                            SvgAttr.fill "#00000050"

                        Detailed width height color ->
                            SvgAttr.fill color
                    ]
                    (case brick.appearance of
                        NormalAppearance ->
                            [ SvgAttr.width (String.fromFloat brickWidth)
                            , SvgAttr.height (String.fromFloat brickHeight)
                            ]

                        Detailed width height color ->
                            [ SvgAttr.width (String.fromFloat width)
                            , SvgAttr.height (String.fromFloat height)
                            ]
                    )
                )
                []
            ]

        GlobalModule.Invisible _ ->
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
    let
        oldBrick =
            withDefault defBrick (Array.get id model.bricks)

        newBrickVisMove =
            oldBrick
                |> GlobalModule.updateOneVisibility model
                |> GlobalModule.updateOneMove model

        newBricks =
            Array.set id newBrickVisMove model.bricks

        newModel =
            { model | bricks = newBricks }
    in
    updateOneBrickCollision id newModel


{-| update brick collision. Used in update. Not exposed.
-}
updateOneBrickCollision : Int -> { model | player : Player.Player, bricks : Array Brick, actEvent : Array Event.ActEvent } -> { model | player : Player.Player, bricks : Array Brick, actEvent : Array Event.ActEvent }
updateOneBrickCollision id model =
    let
        brick =
            Array.get id model.bricks
                |> withDefault defBrick

        newBrick =
            GlobalModule.updateOneCollision model brick

        newBricks =
            Array.set id newBrick model.bricks

        newBricksModel =
            { model | bricks = newBricks }

        newPlayerModel =
            case newBrick.collision of
                GlobalModule.Collide tempNextCollision ->
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
                                                && abs (Tuple.second model.player.velocity)
                                                <= 0.2
                                                && abs (playerDownY - blockUpY)
                                                <= 0.2
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
