module EndPoint exposing
    ( EndPoint
    , init , initDetailed
    , update, view
    )

{-| The EndPoint unit, a small unit that shows the endpoint of a level.


# EndPoint

@docs EndPoint


# Init

@docs endPointWidth, endPointHeight, defEndBox, init


# Update

@ update


# View

@ view

-}

import Array
import GlobalBasics
import MainType
import Player
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr
import ViewMove
import Html.Attributes exposing (width)
import Html.Attributes exposing (height)


{-| "EndPoint" is a record of unit, "pos" describes its position and "collisionBox" describes its collisionbox
-}
type alias EndPoint =
    { pos : GlobalBasics.Pos
    , collisionBox : GlobalBasics.CollisionBox
    }


{-| endPointWidth Constant
-}
endPointWidth : Float
endPointWidth =
    Tuple.first GlobalBasics.blockSize


{-| endPointHeight Constant
-}
endPointHeight : Float
endPointHeight =
    Tuple.second GlobalBasics.blockSize


{-| Default collisionbox
-}
defEndBox : GlobalBasics.CollisionBox
defEndBox =
    GlobalBasics.Polygon
        (Array.fromList
            [ ( ( 0.0, 0.0 ), ( endPointWidth, 0.0 ) )
            , ( ( endPointWidth, 0.0 ), ( endPointWidth, endPointHeight ) )
            , ( ( endPointWidth, endPointHeight ), ( 0.0, endPointHeight ) )
            , ( ( 0.0, endPointHeight ), ( 0.0, 0.0 ) )
            ]
        )


{-| Init an endPoint, only input its position
-}
init : ( Float, Float ) -> EndPoint
init ( x, y ) =
    { pos = ( x, y )
    , collisionBox = defEndBox
    }

initDetailed : (Float,Float) -> (Float,Float) -> EndPoint
initDetailed (x,y) (width,height) =
    {
        pos = (x,y)
    ,   collisionBox = GlobalBasics.Polygon
                                    (Array.fromList
                                        [ ( ( 0.0, 0.0 ), ( width, 0.0 ) )
                                        , ( ( width, 0.0 ), ( width, height ) )
                                        , ( ( width, height ), ( 0.0, height ) )
                                        , ( ( 0.0, height ), ( 0.0, 0.0 ) )
                                        ])
    }

{-| view function of an endPoint
-}
view : { model | endPoint : EndPoint, windowBoundary : GlobalBasics.Pos, levelBoundary : GlobalBasics.Pos, player : Player.Player } -> List (Svg MainType.Msg)
view model =
    let
        ( endPointX, endPointY ) =
            model.endPoint.pos
    in
    [ Svg.rect
        [ SvgAttr.x (String.fromFloat (ViewMove.deltaX model + endPointX))
        , SvgAttr.y (String.fromFloat (ViewMove.deltaY model + endPointY))
        , SvgAttr.width (String.fromFloat endPointWidth)
        , SvgAttr.height (String.fromFloat endPointHeight)
        , SvgAttr.fill "#ff3366"
        ]
        []
    ]


{-| update function of an endPoint
-}
update : ( { model | player : Player.Player, endPoint : EndPoint }, Cmd MainType.Msg ) -> ( { model | player : Player.Player, endPoint : EndPoint }, Cmd MainType.Msg )
update ( model, cmd ) =
    let
        status =
            Player.playerIfCollidePoly model model.endPoint
    in
    if status == GlobalBasics.Collided then
        ( Player.playerWin model, cmd )

    else
        ( model, cmd )
