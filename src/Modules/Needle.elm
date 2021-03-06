module Modules.Needle exposing
    ( NeedleAppearance(..), Needle, NeedleType(..)
    , init, initFalling, initFallingRow, initHiddenRow, normalNeedleWidth, initHidden, initHiddenCollideAfter
    , initHiddenFalling, initHiddenFallingRow, initHiddenFloat, initPos, needleCollisionBox, normalNeedleHeight, sword, deadlyBlock
    , view
    , update
    )

{-| The unit. The most common unit in the game


# Needle

@docs NeedleAppearance, Needle, NeedleType


# Init

@docs init, initFalling, initFallingRow, initHiddenRow, normalNeedleWidth, initHidden, initHiddenCollideAfter
@docs initHiddenFalling, initHiddenFallingRow, initHiddenFloat, initPos, needleCollisionBox, normalNeedleHeight, sword, deadlyBlock


# ViewMove

@docs view


# Update

@docs update

-}

import Array exposing (Array)
import GlobalFunction.GlobalBasics as GlobalBasics
import GlobalFunction.GlobalModule as GlobalModule
import Html exposing (b)
import MainFunction.MainType as MainType
import Maybe exposing (withDefault)
import Modules.Event as Event
import Modules.Player as Player
import Modules.Sound as Sound
import Modules.ViewMove as ViewMove
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr


{-| Different types of needle
-}
type NeedleType
    = Laser
    | BombUp
    | BombLeft
    | Upwards
    | Downwards


{-| For future different shapes of blocks.
-}
type NeedleAppearance
    = NormalNeedle Float Float NeedleType


{-| needleWidth Constant
-}
normalNeedleWidth : Float
normalNeedleWidth =
    Tuple.first GlobalBasics.blockSize


{-| needleHeight Constant
-}
normalNeedleHeight : Float
normalNeedleHeight =
    Tuple.second GlobalBasics.blockSize / 20.0


{-| `Needle` is a record of the block unit. See detail definitions in individual definition. Almost the same as the,
You can see in Block for detail.
-}
type alias Needle =
    { pos : GlobalBasics.Pos
    , collisionBox : GlobalBasics.CollisionBox
    , appearance : NeedleAppearance
    , visibility : GlobalModule.Visibility
    , collision : GlobalModule.Collision
    , move : GlobalModule.Move
    }


{-| DefaultNeedle used with withDefault
-}
defNeedle : Needle
defNeedle =
    initPos ( 0, 0 ) Laser


{-| initiate a needle, with full functions. See in level5Init for examples, it's quite easy to see how to use.
-}
init : ( Float, Float ) -> NeedleAppearance -> GlobalModule.Visibility -> GlobalModule.Collision -> GlobalModule.Move -> Needle
init ( x, y ) needleAppearance visibility collision move =
    { pos = ( x, y )
    , collisionBox = needleCollisionBox needleAppearance
    , appearance = needleAppearance
    , visibility = visibility
    , collision = collision
    , move = move
    }


{-| default appearance, always visible, have collision, don't move. See in level5Init for examples, it's quite easy to
see how to use.
-}
initPos : ( Float, Float ) -> NeedleType -> Needle
initPos ( x, y ) needleType =
    { pos = ( x, y )
    , collisionBox = needleCollisionBox (NormalNeedle normalNeedleWidth normalNeedleHeight needleType)
    , appearance = NormalNeedle normalNeedleWidth normalNeedleHeight needleType
    , visibility = GlobalModule.Visible GlobalModule.NoNextVisibility
    , collision = GlobalModule.Collide GlobalModule.NoNextCollision
    , move = GlobalModule.NoNextMove
    }


{-| quick function to create one hidden needle. See in level5Init for examples, it's quite easy to see how to use.
-}
initHidden : ( Int, Int ) -> Int -> NeedleType -> Needle
initHidden ( x, y ) id needleType =
    { pos = GlobalBasics.blockPos ( x, y )
    , collisionBox = needleCollisionBox (NormalNeedle normalNeedleWidth normalNeedleHeight needleType)
    , appearance = NormalNeedle normalNeedleWidth normalNeedleHeight needleType
    , visibility = GlobalModule.Invisible (GlobalModule.VisibleAfterEvent id GlobalModule.NoNextVisibility)
    , collision = GlobalModule.Collide GlobalModule.NoNextCollision
    , move = GlobalModule.NoNextMove
    }


{-| quick function to create one hidden needle with float pos. See in level5Init for examples, it's quite easy to see
how to use.
-}
initHiddenFloat : ( Float, Float ) -> Int -> NeedleType -> Needle
initHiddenFloat ( x, y ) id needleType =
    { pos = GlobalBasics.blockPosFloat ( x, y )
    , collisionBox = needleCollisionBox (NormalNeedle normalNeedleWidth normalNeedleHeight needleType)
    , appearance = NormalNeedle normalNeedleWidth normalNeedleHeight needleType
    , visibility = GlobalModule.Invisible (GlobalModule.VisibleAfterEvent id GlobalModule.NoNextVisibility)
    , collision = GlobalModule.Collide GlobalModule.NoNextCollision
    , move = GlobalModule.NoNextMove
    }


{-| quick function to create a row of hidden needles. See in level5Init for examples, it's quite easy to see how to use.
-}
initHiddenRow : Float -> Int -> Int -> Int -> NeedleType -> List Needle
initHiddenRow n n1 n2 id needleType =
    List.map (\i -> initHiddenFloat ( toFloat i, n ) id needleType) (List.range n1 n2)


{-| quick function to create a needle which is only collidable after a given event. See in level5Init for examples, it's
quite easy to see how to use.
-}
initHiddenCollideAfter : ( Int, Int ) -> Int -> NeedleType -> Needle
initHiddenCollideAfter ( x, y ) id needleType =
    { pos = GlobalBasics.blockPos ( x, y )
    , collisionBox = needleCollisionBox (NormalNeedle normalNeedleWidth normalNeedleHeight needleType)
    , appearance = NormalNeedle normalNeedleWidth normalNeedleHeight needleType
    , visibility = GlobalModule.Invisible (GlobalModule.VisibleAfterEvent id GlobalModule.NoNextVisibility)
    , collision = GlobalModule.NoCollide (GlobalModule.CollideAfterEvent id GlobalModule.NoNextCollision)
    , move = GlobalModule.NoNextMove
    }


{-| quick function to create one needle which falls after a given event, give an id of -1 to just create a normal needle
row. See in level5Init for examples, it's quite easy to see how to use.
-}
initFalling : ( Int, Int ) -> Int -> NeedleType -> Needle
initFalling ( x, y ) id needleType =
    { pos = GlobalBasics.blockPos ( x, y )
    , collisionBox = needleCollisionBox (NormalNeedle normalNeedleWidth normalNeedleHeight needleType)
    , appearance = NormalNeedle normalNeedleWidth normalNeedleHeight needleType
    , visibility = GlobalModule.Visible GlobalModule.NoNextVisibility
    , collision = GlobalModule.Collide GlobalModule.NoNextCollision
    , move =
        GlobalModule.Move (Array.fromList [])
            0.0
            id
            (GlobalModule.Move (Array.fromList [ GlobalBasics.blockPos ( x, 20 ) ]) 5.0 -1 GlobalModule.NoNextMove)
    }


{-| quick function to create one hidden needle which falls after a given event. See in level5Init for examples, it's
quite easy to see how to use.
-}
initHiddenFalling : ( Int, Int ) -> Int -> NeedleType -> Needle
initHiddenFalling ( x, y ) id needleType =
    { pos = GlobalBasics.blockPos ( x, y )
    , collisionBox = needleCollisionBox (NormalNeedle normalNeedleWidth normalNeedleHeight needleType)
    , appearance = NormalNeedle normalNeedleWidth normalNeedleHeight needleType
    , visibility = GlobalModule.Invisible GlobalModule.NoNextVisibility
    , collision = GlobalModule.Collide GlobalModule.NoNextCollision
    , move =
        GlobalModule.Move (Array.fromList [])
            0.0
            id
            (GlobalModule.Move (Array.fromList [ GlobalBasics.blockPos ( x, 20 ) ]) 5.0 -1 GlobalModule.NoNextMove)
    }


{-| quick function to create one row of needles which falls after a given event. See in level5Init for examples, it's
quite easy to see how to use.
-}
initFallingRow : Int -> Int -> Int -> Int -> NeedleType -> List Needle
initFallingRow n n1 n2 id needleType =
    List.map (\i -> initFalling ( i, n ) id needleType) (List.range n1 n2)


{-| quick function to create one row of hidden needles which falls after a given event. See in level5Init for examples,
it's quite easy to see how to use.
-}
initHiddenFallingRow : Int -> Int -> Int -> Int -> NeedleType -> List Needle
initHiddenFallingRow n n1 n2 id needleType =
    List.map (\i -> initHiddenFalling ( i, n ) id needleType) (List.range n1 n2)


{-| a 'needle' that can customize size
-}
deadlyBlock : ( Float, Float ) -> ( Float, Float ) -> Needle
deadlyBlock pos ( width, height ) =
    init
        (GlobalBasics.blockPosFloat pos)
        (NormalNeedle (width * 40) (height * 40) Laser)
        (GlobalModule.Visible GlobalModule.NoNextVisibility)
        (GlobalModule.Collide GlobalModule.NoNextCollision)
        GlobalModule.NoNextMove


{-| quickfunction to create a sword that will charge for a given position after a given event. See in level5Init for
examples, it's quite easy to see how to use.
-}
sword : ( Float, Float ) -> ( Float, Float ) -> ( Float, Float ) -> Float -> Int -> NeedleType -> Needle
sword startPos chargePos ( width, height ) speed id needleType =
    init
        (GlobalBasics.blockPosFloat startPos)
        (NormalNeedle (width * 40) (height * 40) needleType)
        (GlobalModule.Invisible (GlobalModule.VisibleAfterEvent id GlobalModule.NoNextVisibility))
        (GlobalModule.NoCollide (GlobalModule.CollideAfterEvent id GlobalModule.NoNextCollision))
        (GlobalModule.Move (Array.fromList [])
            0.0
            id
            (GlobalModule.Move (Array.fromList [ GlobalBasics.blockPosFloat chargePos ]) speed -1 GlobalModule.NoNextMove)
        )


{-| default collisionBox
-}
needleCollisionBox : NeedleAppearance -> GlobalBasics.CollisionBox
needleCollisionBox needleAppearance =
    case needleAppearance of
        NormalNeedle width height _ ->
            GlobalBasics.Polygon
                (Array.fromList
                    [ ( ( 0.0, 0.0 ), ( width, 0.0 ) )
                    , ( ( width, 0.0 ), ( width, height ) )
                    , ( ( width, height ), ( 0.0, height ) )
                    , ( ( 0.0, height ), ( 0.0, 0.0 ) )
                    ]
                )


{-| view one needle, used in view, not exposed.
-}
viewOneNeedle : { model | windowBoundary : GlobalBasics.Pos, levelBoundary : GlobalBasics.Pos, player : Player.Player } -> Needle -> List (Svg MainType.Msg)
viewOneNeedle model needle =
    case needle.visibility of
        GlobalModule.Visible _ ->
            let
                ( needleX, needleY ) =
                    needle.pos

                x0 =
                    ViewMove.deltaX model + needleX - 2.0

                y0 =
                    ViewMove.deltaY model + needleY
            in
            case needle.appearance of
                NormalNeedle width height Laser ->
                    [ Svg.rect
                        (List.append
                            [ SvgAttr.x (String.fromFloat (ViewMove.deltaX model + needleX - 2.0))
                            , SvgAttr.y (String.fromFloat (ViewMove.deltaY model + needleY))
                            , SvgAttr.strokeWidth "2"
                            , SvgAttr.stroke "#00000000"
                            , SvgAttr.fill "#FF0000FF"
                            ]
                            [ SvgAttr.width (String.fromFloat (width + 2.0))
                            , SvgAttr.height (String.fromFloat height)
                            ]
                        )
                        []
                    ]

                NormalNeedle width height BombUp ->
                    bombViewUp x0 y0 (width + 2.0) height "#FF0000"

                NormalNeedle width height BombLeft ->
                    bombViewLeft x0 y0 (width + 2.0) height "#FF0000"

                NormalNeedle width height Upwards ->
                    needleViewUp x0 y0 (width + 2.0) height "#FF0000"

                NormalNeedle width height Downwards ->
                    needleViewDown x0 y0 (width + 2.0) height "#FF0000"

        GlobalModule.Invisible _ ->
            []

        _ ->
            []


{-| View one appearance of needle, used in viewOneNeedle, not exposed.
-}
needleViewUp : Float -> Float -> Float -> Float -> String -> List (Svg MainType.Msg)
needleViewUp x y w h color =
    [ Svg.polygon
        [ SvgAttr.points
            (String.fromFloat x
                ++ " "
                ++ String.fromFloat (y + h)
                ++ ", "
                ++ String.fromFloat (x + 0.125 * w)
                ++ " "
                ++ String.fromFloat y
                ++ ", "
                ++ String.fromFloat (x + 0.25 * w)
                ++ " "
                ++ String.fromFloat (y + h)
            )
        , SvgAttr.fill color
        ]
        []
    , Svg.polygon
        [ SvgAttr.points
            (String.fromFloat (x + 0.25 * w)
                ++ " "
                ++ String.fromFloat (y + h)
                ++ ", "
                ++ String.fromFloat (x + 0.375 * w)
                ++ " "
                ++ String.fromFloat y
                ++ ", "
                ++ String.fromFloat (x + 0.5 * w)
                ++ " "
                ++ String.fromFloat (y + h)
            )
        , SvgAttr.fill color
        ]
        []
    , Svg.polygon
        [ SvgAttr.points
            (String.fromFloat (x + 0.5 * w)
                ++ " "
                ++ String.fromFloat (y + h)
                ++ ", "
                ++ String.fromFloat (x + 0.625 * w)
                ++ " "
                ++ String.fromFloat y
                ++ ", "
                ++ String.fromFloat (x + 0.75 * w)
                ++ " "
                ++ String.fromFloat (y + h)
            )
        , SvgAttr.fill color
        ]
        []
    , Svg.polygon
        [ SvgAttr.points
            (String.fromFloat (x + 0.75 * w)
                ++ " "
                ++ String.fromFloat (y + h)
                ++ ", "
                ++ String.fromFloat (x + 0.875 * w)
                ++ " "
                ++ String.fromFloat y
                ++ ", "
                ++ String.fromFloat (x + w)
                ++ " "
                ++ String.fromFloat (y + h)
            )
        , SvgAttr.fill color
        ]
        []
    ]


{-| View one appearance of needle, used in viewOneNeedle, not exposed.
-}
needleViewDown : Float -> Float -> Float -> Float -> String -> List (Svg MainType.Msg)
needleViewDown x y w h color =
    [ Svg.polygon
        [ SvgAttr.points
            (String.fromFloat x
                ++ " "
                ++ String.fromFloat y
                ++ ", "
                ++ String.fromFloat (x + 0.125 * w)
                ++ " "
                ++ String.fromFloat (y + h)
                ++ ", "
                ++ String.fromFloat (x + 0.25 * w)
                ++ " "
                ++ String.fromFloat y
            )
        , SvgAttr.fill color
        ]
        []
    , Svg.polygon
        [ SvgAttr.points
            (String.fromFloat (x + 0.25 * w)
                ++ " "
                ++ String.fromFloat y
                ++ ", "
                ++ String.fromFloat (x + 0.375 * w)
                ++ " "
                ++ String.fromFloat (y + h)
                ++ ", "
                ++ String.fromFloat (x + 0.5 * w)
                ++ " "
                ++ String.fromFloat y
            )
        , SvgAttr.fill color
        ]
        []
    , Svg.polygon
        [ SvgAttr.points
            (String.fromFloat (x + 0.5 * w)
                ++ " "
                ++ String.fromFloat y
                ++ ", "
                ++ String.fromFloat (x + 0.625 * w)
                ++ " "
                ++ String.fromFloat (y + h)
                ++ ", "
                ++ String.fromFloat (x + 0.75 * w)
                ++ " "
                ++ String.fromFloat y
            )
        , SvgAttr.fill color
        ]
        []
    , Svg.polygon
        [ SvgAttr.points
            (String.fromFloat (x + 0.75 * w)
                ++ " "
                ++ String.fromFloat y
                ++ ", "
                ++ String.fromFloat (x + 0.875 * w)
                ++ " "
                ++ String.fromFloat (y + h)
                ++ ", "
                ++ String.fromFloat (x + w)
                ++ " "
                ++ String.fromFloat y
            )
        , SvgAttr.fill color
        ]
        []
    ]


bombViewUp : Float -> Float -> Float -> Float -> String -> List (Svg MainType.Msg)
bombViewUp x y w h color =
    [ Svg.path
        [ SvgAttr.d
            ("M"
                ++ String.fromFloat (x + 0.5 * w)
                ++ " "
                ++ String.fromFloat y
                ++ " Q "
                ++ String.fromFloat x
                ++ " "
                ++ String.fromFloat (y + 0.3 * h)
                ++ " "
                ++ String.fromFloat x
                ++ " "
                ++ String.fromFloat (y + 0.5 * h)
                ++ " L "
                ++ String.fromFloat x
                ++ " "
                ++ String.fromFloat (y + 0.85 * h)
                ++ " L "
                ++ String.fromFloat (x + w)
                ++ " "
                ++ String.fromFloat (y + 0.85 * h)
                ++ " L "
                ++ String.fromFloat (x + w)
                ++ " "
                ++ String.fromFloat (y + 0.5 * h)
                ++ " Q "
                ++ String.fromFloat (x + w)
                ++ " "
                ++ String.fromFloat (y + 0.3 * h)
                ++ " "
                ++ String.fromFloat (x + 0.5 * w)
                ++ " "
                ++ String.fromFloat y
            )
        , SvgAttr.fill color
        , SvgAttr.stroke "#000000"
        , SvgAttr.strokeWidth "1"
        ]
        []
    , Svg.path
        [ SvgAttr.d
            ("M"
                ++ String.fromFloat (x + 0.5 * w)
                ++ " "
                ++ String.fromFloat (y + 1.15 * h + 0.5)
                ++ " Q "
                ++ String.fromFloat (x + 0.1 * w)
                ++ " "
                ++ String.fromFloat (y + h + 0.5)
                ++ " "
                ++ String.fromFloat (x + 0.1 * w)
                ++ " "
                ++ String.fromFloat (y + 0.85 * h + 0.5)
                ++ " L "
                ++ String.fromFloat (x + 0.9 * w)
                ++ " "
                ++ String.fromFloat (y + 0.85 * h + 0.5)
                ++ " Q "
                ++ String.fromFloat (x + 0.9 * w)
                ++ " "
                ++ String.fromFloat (y + h + 0.5)
                ++ " "
                ++ String.fromFloat (x + 0.5 * w)
                ++ " "
                ++ String.fromFloat (y + 1.15 * h + 0.5)
            )
        , SvgAttr.fill "#FFFF00"
        , SvgAttr.stroke "#000000"
        , SvgAttr.strokeWidth "1"
        ]
        []
    , Svg.line
        [ SvgAttr.x1 (String.fromFloat (x + 0.4 * w))
        , SvgAttr.y1 (String.fromFloat (y + 0.6 * h))
        , SvgAttr.x2 (String.fromFloat (x + 0.6 * w))
        , SvgAttr.y2 (String.fromFloat (y + 0.6 * h))
        , SvgAttr.stroke "#000000"
        , SvgAttr.strokeWidth "2"
        ]
        []
    , Svg.line
        [ SvgAttr.x1 (String.fromFloat (x + 0.24 * w))
        , SvgAttr.y1 (String.fromFloat (y + 0.4 * h))
        , SvgAttr.x2 (String.fromFloat (x + 0.4 * w))
        , SvgAttr.y2 (String.fromFloat (y + 0.45 * h + 1))
        , SvgAttr.stroke "#000000"
        , SvgAttr.strokeWidth "2"
        ]
        []
    , Svg.line
        [ SvgAttr.x1 (String.fromFloat (x + 0.4 * w))
        , SvgAttr.y1 (String.fromFloat (y + 0.45 * h))
        , SvgAttr.x2 (String.fromFloat (x + 0.24 * w))
        , SvgAttr.y2 (String.fromFloat (y + 0.5 * h))
        , SvgAttr.stroke "#000000"
        , SvgAttr.strokeWidth "2"
        ]
        []
    , Svg.line
        [ SvgAttr.x1 (String.fromFloat (x + 0.76 * w))
        , SvgAttr.y1 (String.fromFloat (y + 0.4 * h))
        , SvgAttr.x2 (String.fromFloat (x + 0.6 * w))
        , SvgAttr.y2 (String.fromFloat (y + 0.45 * h + 1))
        , SvgAttr.stroke "#000000"
        , SvgAttr.strokeWidth "2"
        ]
        []
    , Svg.line
        [ SvgAttr.x1 (String.fromFloat (x + 0.6 * w))
        , SvgAttr.y1 (String.fromFloat (y + 0.45 * h))
        , SvgAttr.x2 (String.fromFloat (x + 0.76 * w))
        , SvgAttr.y2 (String.fromFloat (y + 0.5 * h))
        , SvgAttr.stroke "#000000"
        , SvgAttr.strokeWidth "2"
        ]
        []
    ]


bombViewLeft : Float -> Float -> Float -> Float -> String -> List (Svg MainType.Msg)
bombViewLeft x y w h color =
    [ Svg.path
        [ SvgAttr.d
            ("M"
                ++ String.fromFloat x
                ++ " "
                ++ String.fromFloat (y + 0.5 * h)
                ++ " Q "
                ++ String.fromFloat (x + 0.3 * w)
                ++ " "
                ++ String.fromFloat y
                ++ " "
                ++ String.fromFloat (x + 0.5 * w)
                ++ " "
                ++ String.fromFloat y
                ++ " L "
                ++ String.fromFloat (x + 0.85 * w)
                ++ " "
                ++ String.fromFloat y
                ++ " L "
                ++ String.fromFloat (x + 0.85 * w)
                ++ " "
                ++ String.fromFloat (y + h)
                ++ " L "
                ++ String.fromFloat (x + 0.5 * w)
                ++ " "
                ++ String.fromFloat (y + h)
                ++ " Q "
                ++ String.fromFloat (x + 0.3 * w)
                ++ " "
                ++ String.fromFloat (y + h)
                ++ " "
                ++ String.fromFloat x
                ++ " "
                ++ String.fromFloat (y + 0.5 * h)
            )
        , SvgAttr.fill color
        , SvgAttr.stroke "#000000"
        , SvgAttr.strokeWidth "1"
        ]
        []
    , Svg.path
        [ SvgAttr.d
            ("M"
                ++ String.fromFloat (x + 1.15 * w + 0.5)
                ++ " "
                ++ String.fromFloat (y + 0.5 * h)
                ++ " Q "
                ++ String.fromFloat (x + w + 0.5)
                ++ " "
                ++ String.fromFloat (y + 0.1 * h)
                ++ " "
                ++ String.fromFloat (x + 0.85 * w + 0.5)
                ++ " "
                ++ String.fromFloat (y + 0.1 * h)
                ++ " L "
                ++ String.fromFloat (x + 0.85 * w + 0.5)
                ++ " "
                ++ String.fromFloat (y + 0.9 * h)
                ++ " Q "
                ++ String.fromFloat (x + w + 0.5)
                ++ " "
                ++ String.fromFloat (y + 0.9 * h)
                ++ " "
                ++ String.fromFloat (x + 1.15 * w + 0.5)
                ++ " "
                ++ String.fromFloat (y + 0.5 * h)
            )
        , SvgAttr.fill "#FFFF00"
        , SvgAttr.stroke "#000000"
        , SvgAttr.strokeWidth "1"
        ]
        []
    , Svg.line
        [ SvgAttr.x1 (String.fromFloat (x + 0.6 * w))
        , SvgAttr.y1 (String.fromFloat (y + 0.4 * h))
        , SvgAttr.x2 (String.fromFloat (x + 0.6 * w))
        , SvgAttr.y2 (String.fromFloat (y + 0.6 * h))
        , SvgAttr.stroke "#000000"
        , SvgAttr.strokeWidth "2"
        ]
        []
    , Svg.line
        [ SvgAttr.x1 (String.fromFloat (x + 0.4 * w))
        , SvgAttr.y1 (String.fromFloat (y + 0.24 * h))
        , SvgAttr.x2 (String.fromFloat (x + 0.45 * w + 1))
        , SvgAttr.y2 (String.fromFloat (y + 0.4 * h))
        , SvgAttr.stroke "#000000"
        , SvgAttr.strokeWidth "2"
        ]
        []
    , Svg.line
        [ SvgAttr.x1 (String.fromFloat (x + 0.45 * w))
        , SvgAttr.y1 (String.fromFloat (y + 0.4 * h))
        , SvgAttr.x2 (String.fromFloat (x + 0.5 * w))
        , SvgAttr.y2 (String.fromFloat (y + 0.24 * h))
        , SvgAttr.stroke "#000000"
        , SvgAttr.strokeWidth "2"
        ]
        []
    , Svg.line
        [ SvgAttr.x1 (String.fromFloat (x + 0.4 * w))
        , SvgAttr.y1 (String.fromFloat (y + 0.76 * h))
        , SvgAttr.x2 (String.fromFloat (x + 0.45 * w + 1))
        , SvgAttr.y2 (String.fromFloat (y + 0.6 * h))
        , SvgAttr.stroke "#000000"
        , SvgAttr.strokeWidth "2"
        ]
        []
    , Svg.line
        [ SvgAttr.x1 (String.fromFloat (x + 0.45 * w))
        , SvgAttr.y1 (String.fromFloat (y + 0.6 * h))
        , SvgAttr.x2 (String.fromFloat (x + 0.5 * w))
        , SvgAttr.y2 (String.fromFloat (y + 0.76 * h))
        , SvgAttr.stroke "#000000"
        , SvgAttr.strokeWidth "2"
        ]
        []
    ]


{-| view function of needle. Will view each needle according to its appearance.
-}
view : { model | needles : Array Needle, windowBoundary : GlobalBasics.Pos, levelBoundary : GlobalBasics.Pos, player : Player.Player } -> List (Svg MainType.Msg)
view model =
    let
        needlesList =
            Array.toList model.needles

        svgNeedleListList =
            List.map (\needle -> viewOneNeedle model needle) needlesList
    in
    List.concat svgNeedleListList


{-| update function of needle unit. Update each needle individually.
-}
update : ( { model | player : Player.Player, needles : Array Needle, actEvent : Array Event.ActEvent, sound : Sound.Sound }, Cmd MainType.Msg ) -> ( { model | player : Player.Player, needles : Array Needle, actEvent : Array Event.ActEvent, sound : Sound.Sound }, Cmd MainType.Msg )
update ( model, cmd ) =
    ( List.foldl updateOneNeedle model (List.range 0 (Array.length model.needles - 1)), cmd )


{-| update one needle. Used in update. Not exposed.
-}
updateOneNeedle : Int -> { model | player : Player.Player, needles : Array Needle, actEvent : Array Event.ActEvent, sound : Sound.Sound } -> { model | player : Player.Player, needles : Array Needle, actEvent : Array Event.ActEvent, sound : Sound.Sound }
updateOneNeedle id model =
    let
        needle =
            Array.get id model.needles
                |> withDefault defNeedle

        newNeedle =
            needle
                |> GlobalModule.updateOneVisibility model
                |> GlobalModule.updateOneMove model

        newNeedles =
            Array.set id newNeedle model.needles
    in
    { model | needles = newNeedles }
        |> updateOneNeedleCollision id


{-| update needle collision. Used in update. Not exposed.
-}
updateOneNeedleCollision : Int -> { model | player : Player.Player, needles : Array Needle, actEvent : Array Event.ActEvent, sound : Sound.Sound } -> { model | player : Player.Player, needles : Array Needle, actEvent : Array Event.ActEvent, sound : Sound.Sound }
updateOneNeedleCollision id model =
    let
        needle =
            Array.get id model.needles
                |> withDefault defNeedle

        nextCollision =
            case needle.collision of
                GlobalModule.Collide tempNextCollision ->
                    tempNextCollision

                GlobalModule.NoCollide tempNextCollision ->
                    tempNextCollision

                _ ->
                    GlobalModule.NoNextCollision

        newNeedleCollision =
            case nextCollision of
                GlobalModule.CollideAfterEvent eventID nextNextCollision ->
                    if Event.ifActEventById model eventID == Event.ActEventAct then
                        GlobalModule.Collide nextNextCollision

                    else
                        needle.collision

                GlobalModule.NoCollideAfterEvent eventID nextNextCollision ->
                    if Event.ifActEventById model eventID == Event.ActEventAct then
                        GlobalModule.NoCollide nextNextCollision

                    else
                        needle.collision

                _ ->
                    needle.collision

        newNeedle =
            { needle | collision = newNeedleCollision }

        newNeedles =
            Array.set id newNeedle model.needles

        newNeedlesModel =
            { model | needles = newNeedles }

        newPlayerModel =
            case newNeedleCollision of
                GlobalModule.Collide tempNextCollision ->
                    if Player.playerIfCollidePoly newNeedlesModel needle == GlobalBasics.NotCollided then
                        newNeedlesModel

                    else
                        Sound.trigger (Player.playerDead newNeedlesModel Player.StepOnNeedle) Sound.Needle

                _ ->
                    newNeedlesModel
    in
    newPlayerModel
