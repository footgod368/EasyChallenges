--module Boundary exposing
--    ( BoundaryType, Boundary
--    , init, normalInit
--    , view
--    , update
--    )


module Boundary exposing
    ( BoundaryType(..), Boundary
    , init, normalInit
    , view
    , update
    )

{-| The boundaries in each level


# Type

@docs BoundaryType, Boundary


# Init

@docs init, normalInit


# View

@docs boundaryWidth, viewOneBoundary, view


# Update

@docs update, updateOneBoundary

-}

import Array
import GlobalBasics
import MainType
import Player
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr
import ViewMove


{-| `BoundaryType` describes what if the player collide with the boundary. `BoundaryNoCollide` will have no effect,
`BoundaryCollide` will collide with player, `BoundaryCollideGround` will refresh player jump once he collides,
`BoundaryDeath` will makes player dead.
-}
type BoundaryType
    = BoundaryNoCollide
    | BoundaryCollide
    | BoundaryCollideGround
    | BoundaryDeath


{-| `Boundary` stores the four `BoundaryType`s for each of the scene boundary.
-}
type alias Boundary =
    { upBoundary : BoundaryType
    , downBoundary : BoundaryType
    , leftBoundary : BoundaryType
    , rightBoundary : BoundaryType
    }


{-| Initiate `Boundary` with specific four `BoundaryType`s, namely up, down, left, right. You can use it like this:

    newBoundary : Boundary
    newBoundary =
        init BoundaryCollide BoundaryDeath BoundaryCollide BoundaryCollide

-}
init : BoundaryType -> BoundaryType -> BoundaryType -> BoundaryType -> Boundary
init upBoundary downBoundary leftBoundary rightBoundary =
    Boundary upBoundary downBoundary leftBoundary rightBoundary


{-| The common Boundary, up left and right boundaries will collide, while the bottom boundary will cause death. You
can use it like this:

    newBoundary : Boundary
    newBoundary =
        normalInit

-}
normalInit : Boundary
normalInit =
    Boundary BoundaryCollide BoundaryDeath BoundaryCollide BoundaryCollide


{-| width of the boundary
-}
boundaryWidth : Float
boundaryWidth =
    2.0


{-| draw one boundary, used in `view`, not exposed
-}
viewOneBoundary : { model | windowBoundary : GlobalBasics.Pos, levelBoundary : GlobalBasics.Pos, player : Player.Player } -> GlobalBasics.Pos -> GlobalBasics.Pos -> BoundaryType -> Svg MainType.Msg
viewOneBoundary model anchor area boundaryType =
    Svg.rect
        [ SvgAttr.x (String.fromFloat (Tuple.first anchor + ViewMove.deltaX model))
        , SvgAttr.y (String.fromFloat (Tuple.second anchor + ViewMove.deltaY model))
        , SvgAttr.width (String.fromFloat (Tuple.first area))
        , SvgAttr.height (String.fromFloat (Tuple.second area))
        , SvgAttr.fill
            (case boundaryType of
                BoundaryNoCollide ->
                    "#00000000"

                BoundaryCollide ->
                    "#000000FF"

                BoundaryCollideGround ->
                    "#000000FF"

                BoundaryDeath ->
                    "#FF0000"
            )
        ]
        []


{-| `view` draws the four boundaries due to their `BoundaryType`
-}
view : { model | boundary : Boundary, windowBoundary : GlobalBasics.Pos, levelBoundary : GlobalBasics.Pos, player : Player.Player } -> List (Svg MainType.Msg)
view model =
    let
        ( levelBoundaryX, levelBoundaryY ) =
            model.levelBoundary
    in
    [ viewOneBoundary model ( boundaryWidth, 0 ) ( levelBoundaryX, boundaryWidth ) model.boundary.upBoundary
    , viewOneBoundary model
        ( boundaryWidth, levelBoundaryY - boundaryWidth )
        ( levelBoundaryX, boundaryWidth )
        model.boundary.downBoundary
    , viewOneBoundary model ( 0, 0 ) ( boundaryWidth, levelBoundaryY ) model.boundary.leftBoundary
    , viewOneBoundary model ( levelBoundaryX - boundaryWidth, 0 ) ( boundaryWidth, levelBoundaryY ) model.boundary.rightBoundary
    ]


{-| update one boundary's collision with player, used in `update`, not exposed.
-}
updateOneBoundary : GlobalBasics.Pos -> GlobalBasics.Pos -> BoundaryType -> ( { model | player : Player.Player }, Cmd MainType.Msg ) -> ( { model | player : Player.Player }, Cmd MainType.Msg )
updateOneBoundary anchor area boundaryType ( model, cmd ) =
    let
        ( anchorX, anchorY ) =
            anchor

        ( areaX, areaY ) =
            area

        collisionBox =
            GlobalBasics.Polygon
                (Array.fromList
                    [ ( ( anchorX, anchorY ), ( anchorX + areaX, anchorY ) )
                    , ( ( anchorX + areaX, anchorY ), ( anchorX + areaX, anchorY + areaY ) )
                    , ( ( anchorX + areaX, anchorY + areaY ), ( anchorX, anchorY + areaY ) )
                    , ( ( anchorX, anchorY + areaY ), ( anchorX, anchorY ) )
                    ]
                )
    in
    case boundaryType of
        BoundaryNoCollide ->
            ( model, cmd )

        BoundaryCollide ->
            ( Player.playerCollideRigidBody
                model
                { pos = ( 0.0, 0.0 )
                , collisionBox = collisionBox
                }
            , cmd
            )

        BoundaryCollideGround ->
            if Player.playerIfCollidePoly model { pos = ( 0.0, 0.0 ), collisionBox = collisionBox } == GlobalBasics.Collided then
                let
                    refreshJumpModel =
                        Player.playerRefreshJump model

                    newModel =
                        Player.playerCollideRigidBody
                            refreshJumpModel
                            { pos = ( 0.0, 0.0 )
                            , collisionBox = collisionBox
                            }
                in
                ( newModel, cmd )

            else
                ( model, cmd )

        BoundaryDeath ->
            let
                ifCollide =
                    Player.playerIfCollidePoly model { pos = ( 0.0, 0.0 ), collisionBox = collisionBox }

                newModel =
                    if ifCollide == GlobalBasics.Collided then
                        Player.playerDead model

                    else
                        model
            in
            ( Player.playerCollideRigidBody
                newModel
                { pos = ( 0.0, 0.0 )
                , collisionBox = collisionBox
                }
            , cmd
            )


{-| `update` updates collision of the boundaries
-}
update : ( { model | boundary : Boundary, windowBoundary : GlobalBasics.Pos, levelBoundary : GlobalBasics.Pos, player : Player.Player }, Cmd MainType.Msg ) -> ( { model | boundary : Boundary, windowBoundary : GlobalBasics.Pos, levelBoundary : GlobalBasics.Pos, player : Player.Player }, Cmd MainType.Msg )
update ( model, cmd ) =
    let
        ( levelBoundaryX, levelBoundaryY ) =
            model.levelBoundary
    in
    ( model, cmd )
        |> updateOneBoundary ( 0, 0 ) ( levelBoundaryX, boundaryWidth ) model.boundary.upBoundary
        |> updateOneBoundary ( 0, levelBoundaryY ) ( levelBoundaryX, boundaryWidth ) model.boundary.downBoundary
        |> updateOneBoundary ( 0, 0 ) ( boundaryWidth, levelBoundaryY ) model.boundary.leftBoundary
        |> updateOneBoundary ( levelBoundaryX, 0 ) ( boundaryWidth, levelBoundaryY ) model.boundary.rightBoundary
