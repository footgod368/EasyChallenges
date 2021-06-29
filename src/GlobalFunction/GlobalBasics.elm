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