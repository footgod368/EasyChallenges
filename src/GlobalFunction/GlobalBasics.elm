module GlobalBasics exposing
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



{-| `CollisionStatus` is a typed used in collide function return
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

