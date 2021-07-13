module Monster exposing (..)

import Array exposing (Array)
import Event
import GlobalBasics
import MainType
import Maybe exposing (withDefault)
import Player
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr
import ViewMove

type alias Monster =
    { pos: GlobalBasics.Pos
    , collisionBox : GlobalBasics.CollisionBox
    , appearance : MonsterAppearance
    , xMode: MonsterXMode
    , yMode: MonsterYMode
    , mode: MonsterMode
    , speed: Float
    }

type MonsterAppearance 
    = MonsterA Float Float

type MonsterXMode
    = Stop
    | Move

type MonsterYMode 
    = Stop
    | Follow

type MonsterMode
    = ChangeMode MonsterXMode MonsterYMode Float Int MonsterMode
    | NoNextChangeMode

init : ( Float, Float ) -> MonsterAppearance -> MonsterXMode -> MonsterYMode -> MonsterMode -> Float -> Monster
init ( x, y ) monsterAppearance monsterX monsterY monsterMode speed =
    { pos = ( x, y )
    , collisionBox = monsterCollisionBox monsterAppearance
    , appearance = monsterAppearance
    , xMode = monsterX
    , yMode = monsterY
    , mode = monsterMode
    , speed = speed
    }

{-| default collisionBox
-}
monsterCollisionBox : MonsterAppearance -> GlobalBasics.CollisionBox
monsterCollisionBox monsterAppearance =
    case monsterAppearance of
        MonsterA width height ->
            GlobalBasics.Polygon
                (Array.fromList
                    [ ( ( 0.0, 0.0 ), ( width, 0.0 ) )
                    , ( ( width, 0.0 ), ( width, height ) )
                    , ( ( width, height ), ( 0.0, height ) )
                    , ( ( 0.0, height ), ( 0.0, 0.0 ) )
                    ]
                )

