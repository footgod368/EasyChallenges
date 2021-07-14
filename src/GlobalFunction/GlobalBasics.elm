module GlobalBasics exposing
    ( Pos, addPosPos, minusPosPos, distPosPos
    , LineSeg, addLSPos, minusLSPos, addPolyPos
    , defPos, defLineSeg, defPoly
    , CollisionStatus(..), CollisionBox(..), ifCollideLSPoly, ifCollidePolyPoly
    , blockPos, blockSize,blockPos_
    )

{-| The global types that are used in all game.


# Position

@docs Pos, addPosPos, minusPosPos, distPosPos


# LineSegment

@docs LineSeg, addLSPos, minusLSPos, addPolyPos


# Default

@docs defPos, defLineSeg, defPoly


# Collide

@docs CollisionStatus, CollisionBox, vecCrossProd, ifPosOneLs, ifCollideLSLS, ifCollideLSPoly, ifCollidePolyPoly


# Stage Index

@ docs blockSize, blockPos

-}

--module GlobalBasics exposing (..)

import Array exposing (Array)


{-| A `Pos` is position value in cartesian coordinate, stored as a `Tuple` of
two `Float` values. You can declare this way:

    p : Pos
    p =
        ( 1.2, 3.0 )

    This corresponds to a point that x = 1.2, y = 3.0.

-}
type alias Pos =
    ( Float, Float )


{-| Add two `Pos`, same as adding position values in cartesian coordinate. You
can do it this way:

    p1 : Pos
    p1 =
        ( 1.1, 3.2 )

    p2 : Pos
    p2 =
        ( 7.5, 3.5 )

    p3 == ( 8.6, 6.7 )
    p3 : Pos
    p3 =
        addPosPos p1 p2

-}
addPosPos : Pos -> Pos -> Pos
addPosPos p1 p2 =
    let
        ( p1X, p1Y ) =
            p1

        ( p2X, p2Y ) =
            p2
    in
    ( p1X + p2X, p1Y + p2Y )


{-| Minus two `Pos`, same as minus position values in cartesian coordinate. Negation of `addPosPos`
-}
minusPosPos : Pos -> Pos -> Pos
minusPosPos p1 p2 =
    let
        ( p1X, p1Y ) =
            p1

        ( p2X, p2Y ) =
            p2
    in
    ( p1X - p2X, p1Y - p2Y )


{-| Return the distance between two points.You can do it this way:

    p1 : Pos
    p1 =
        ( 3, 0 )

    p2 : Pos
    p2 =
        ( 0, 4 )

    -- l == 5.0
    l : Float
    l =
        distPosPos p1 p2

-}
distPosPos : Pos -> Pos -> Float
distPosPos p1 p2 =
    let
        ( p1X, p1Y ) =
            p1

        ( p2X, p2Y ) =
            p2
    in
    sqrt ((p1X - p2X) * (p1X - p2X) + (p1Y - p2Y) * (p1Y - p2Y))


{-| A `LineSeg` is line segment, representing a line segment that forms by two
points in cartesian coordinate, stored asa `Tuple` of `Pos` values. You can do
it this way:

    p1 : Pos
    p1 =
        ( 0, 1 )

    p2 : Pos
    p2 =
        ( 2, 4 )

    l : LineSeg
    l =
        ( p1, p2 )

-}
type alias LineSeg =
    ( Pos, Pos )


{-| Add `Pos` to each `Pos` value in `LineSeg`, representing a spatial alternation (in detail, add a vector) to a
`LineSeg` You can do it this way:

    p1 : Pos
    p1 =
        ( 0, 1 )

    p2 : Pos
    p2 =
        ( 2, 4 )

    -- l == ( ( 0, 1 ), ( 2, 4 ) )
    l : LineSeg
    l =
        ( p1, p2 )

    v1 : Pos
    v1 =
        ( 1, 1 )

    newL == ( ( 1, 2 ), ( 3, 5 ) )
    newL : LineSeg
    newL =
        addLSPos l v1

newL representing this line segments is altered by a vector ( 1, 1 )

-}
addLSPos : LineSeg -> Pos -> LineSeg
addLSPos ls p =
    let
        ( p1, p2 ) =
            ls
    in
    ( addPosPos p1 p, addPosPos p2 p )


{-| Minus `Pos` to each `Pos` value in `LineSeg`, representing a spatial alternation (in detail, minus a vector) to a
`LineSeg`. Negation of addLsPos.
-}
minusLSPos : LineSeg -> Pos -> LineSeg
minusLSPos ls p =
    let
        ( p1, p2 ) =
            ls
    in
    ( minusPosPos p1 p, minusPosPos p2 p )


{-| `addPolyPos` adds a `Pos` to all `LineSegment` in a polygon. You can use it like this

    p : Pos
    p =
        ( 1.0, 1.0 )

    poly : Array LineSegment
    poly =
        Array.fromList [ ( ( 20.0, 10.0 ), ( 20.0, 50.0 ) ), ( ( 20.0, 50.0 ), ( 60.0, 50.0 ) ) ]

    -- newPoly == Array.fromList [ ( ( 21.0, 11.0), ( 21.0, 51.0 ) ), ( ( 21.0, 51.0), ( 61.0, 51.0 ) ) ]
    newPoly : ArrayLineSegment
    newPoly =
        addPoly poly p

-}
addPolyPos : Array LineSeg -> Pos -> Array LineSeg
addPolyPos poly p =
    Array.map (\ls -> addLSPos ls p) poly


{-| default `Position`, used with `withDefault`
-}
defPos : Pos
defPos =
    ( 0.0, 0.0 )


{-| default `LineSeg`, used with `withDefault`
-}
defLineSeg : LineSeg
defLineSeg =
    ( defPos, defPos )


{-| default poly, used with `withDefault`
-}
defPoly : Array LineSeg
defPoly =
    Array.fromList []


{-| `CollisionStatus` is a type used in collide function return
-}
type CollisionStatus
    = Collided
    | NotCollided


{-| `CollisionBox` is a type used in collide judgement, `Polygon` is a polygon collisionBox, storing all the
`LineSeg` that construct the polygon, `Circle (heart : Pos) (radius : Float)` is a circle collisionBox, storing the
heart and the radius of the circle.
-}
type CollisionBox
    = Polygon (Array LineSeg)



--| Circle Pos Float


{-| `vecCrossProd` is a number that judges the relative direction of two vectors by the positive or negative value.
Used in collision judgement. Not exposed
-}
vecCrossProd : Pos -> Pos -> Float
vecCrossProd p1 p2 =
    let
        ( p1X, p1Y ) =
            p1

        ( p2X, p2Y ) =
            p2
    in
    p1X * p2Y - p2X * p1Y


{-| `ifPosOnLs` judges whether a point is one a `LineSegment`. Used in `ifCollideLsLs`. Not exposed.
-}
ifPosOnLs : Pos -> LineSeg -> Bool
ifPosOnLs p ls =
    let
        ( pX, pY ) =
            p

        ( lsP1, lsP2 ) =
            ls

        ( ( ls1X, ls1Y ), ( ls2X, ls2Y ) ) =
            ls

        minLSX =
            min ls1X ls2X

        maxLSX =
            max ls1X ls2X

        minLSY =
            min ls1Y ls2Y

        maxLSY =
            max ls1Y ls2Y
    in
    if minLSX <= pX && pX <= maxLSX && minLSY <= pY && pY <= maxLSY then
        if vecCrossProd (minusPosPos p lsP1) (minusPosPos p lsP2) == 0.0 then
            True

        else
            False

    else
        False


{-| `ifCollideLineSegLineSeg judges whether two LineSeg Collides. Used in`ifCollideLsPoly\`. Not exposed.
-}
ifCollideLSLS : LineSeg -> LineSeg -> CollisionStatus
ifCollideLSLS ls1 ls2 =
    let
        ( ls1P1, ls1P2 ) =
            ls1

        ( ls2P1, ls2P2 ) =
            ls2
    in
    if ifPosOnLs ls1P1 ls2 || ifPosOnLs ls1P2 ls2 || ifPosOnLs ls2P1 ls1 || ifPosOnLs ls2P2 ls1 then
        Collided

    else
        let
            v1P1_1P2 =
                minusPosPos ls1P1 ls1P2

            v2P1_2P2 =
                minusPosPos ls2P1 ls2P2

            v1P1_2P1 =
                minusPosPos ls1P1 ls2P1

            v1P1_2P2 =
                minusPosPos ls1P1 ls2P2

            v1P2_2P1 =
                minusPosPos ls1P2 ls2P1

            v1P2_2P2 =
                minusPosPos ls1P2 ls2P2

            if1P1 =
                vecCrossProd v1P1_2P1 v1P1_1P2 * vecCrossProd v1P1_2P2 v1P1_1P2 < 0

            if2P1 =
                vecCrossProd v1P2_2P1 v2P1_2P2 * vecCrossProd v1P1_2P1 v2P1_2P2 < 0
        in
        if if1P1 && if2P1 then
            Collided

        else
            NotCollided


{-| `ifCollideLSPoly` judges whether a `LineSeg` collides with any `LineSeg` in an array, which can be viewed as a
polygon. You can use it this way:

    ls : LineSeg
    ls =
        ( ( 0.0, 0.0 ), ( 2.0, 2.0 ) )

    poly : Array LineSeg
    poly =
        Array.fromList [ ( ( 0.0, 2.0 ), ( 2.0, 0.0 ) ), ( ( 2.0, 0.0 ), ( 0.0, -2.0 ) ) ]

    --collisionStatus == Collided
    collisionStatus : CollisionStatus
    collisionStatus =
        ifCollideLsPoly ls poly

-}
ifCollideLSPoly : LineSeg -> Array LineSeg -> CollisionStatus
ifCollideLSPoly ls poly =
    let
        ifNotCollided =
            Array.filter (\polyLS -> ifCollideLSLS ls polyLS == Collided) poly
                |> Array.isEmpty
    in
    if ifNotCollided then
        NotCollided

    else
        Collided


{-| `ifCollidePolyPoly` judges whether two polygons collide with each other in any two `LineSegment` in them. Polygons
are defined as Array LineSegment. You can use it this way.

    poly1 : Array LineSeg
    poly1 =
        Array.fromList [ ( ( 0.0, 2.0 ), ( 2.0, 2.0 ) ), ( ( 2.0, 2.0 ), ( 4.0, 0.0 ) ) ]

    poly2 : Array LineSeg
    poly2 =
        Array.fromList [ ( ( 0.0, 2.0 ), ( 2.0, 0.0 ) ), ( ( 2.0, 0.0 ), ( 0.0, -2.0 ) ) ]

    --collisionStatus == Collided
    collisionStatus : CollisionStatus
    collisionStatus =
        ifCollidePolyPoly poly1 poly2

-}
ifCollidePolyPoly : Array LineSeg -> Array LineSeg -> CollisionStatus
ifCollidePolyPoly poly1 poly2 =
    let
        ifNotCollided =
            Array.filter (\poly1LS -> ifCollideLSPoly poly1LS poly2 == Collided) poly1
                |> Array.isEmpty
    in
    if ifNotCollided then
        NotCollided

    else
        Collided


{-| The size of the block
-}
blockSize : ( Float, Float )
blockSize =
    ( 40.0, 40.0 )


{-| Along current block size, input the position returns the actual position
-}
blockPos : ( Int, Int ) -> ( Float, Float )
blockPos ( x, y ) =
    let
        ( blockX, blockY ) =
            blockSize

        posX =
            (toFloat x - 1.0) * blockX

        posY =
            (toFloat y - 1.0) * blockY
    in
    ( posX, posY )

blockPos_ : ( Float, Float ) -> ( Float, Float )
blockPos_ ( x, y ) =
    let
        ( blockX, blockY ) =
            blockSize

        posX =
            (x - 1.0) * blockX

        posY =
            (y - 1.0) * blockY
    in
    ( posX, posY )
