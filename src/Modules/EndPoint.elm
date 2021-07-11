module EndPoint exposing (..)

import Array
import GlobalBasics
import MainType
import Player
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr
import ViewMove

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
init: ( Float, Float ) -> EndPoint
init ( x, y ) =
    { pos = ( x, y )
    , collisionBox = defEndBox
    }

view: { model | endPoint : EndPoint, windowBoundary : GlobalBasics.Pos, levelBoundary : GlobalBasics.Pos, player : Player.Player } -> List (Svg MainType.Msg)
view model =
    let
        ( endPointX, endPointY ) = model.endPoint.pos
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

update : ( { model | player : Player.Player, endPoint : EndPoint }, Cmd MainType.Msg ) -> ( { model | player : Player.Player, endPoint : EndPoint }, Cmd MainType.Msg )
update ( model, cmd ) =
    let
        status = Player.playerIfCollidePoly model model.endPoint
        newplayer = Player.playerWin model.player
    in
    if status == GlobalBasics.Collided then
        ( { model | player = newplayer} , cmd )
    else
        ( model, cmd )