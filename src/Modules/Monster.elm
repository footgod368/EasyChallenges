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
    , xSpeed: Float
    , ySpeed: Float
    }

type MonsterAppearance 
    = MonsterA Float Float

type MonsterXMode
    = Stop
    | Listen Float
    | Move

type MonsterYMode 
    = Stop
    | Listen Float
    | Follow


init : ( Float, Float ) -> MonsterAppearance -> MonsterXMode -> MonsterYMode ->  Float -> Monster
init ( x, y ) monsterAppearance monsterX monsterY xSpeed =
    { pos = ( x, y )
    , collisionBox = monsterCollisionBox monsterAppearance
    , appearance = monsterAppearance
    , xMode = monsterX
    , yMode = monsterY
    , xSpeed = xSpeed
    , ySpeed = 0
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

defMonster : Monster
defMonster = init ( 0, 0 ) ( MonsterA 20 20 ) Stop Stop 1

update : ( { model | player : Player.Player, monsters : Array Monster, actEvent : Array Event.ActEvent }, Cmd MainType.Msg ) -> ( { model | player : Player.Player, monsters : Array Monster, actEvent : Array Event.ActEvent }, Cmd MainType.Msg )
update ( model, cmd ) =
    ( List.foldl updateOneMonster model (List.range 0 (Array.length model.monsters - 1)), cmd )


{-| update one monster. Used in update. Not exposed.
-}
updateOneMonster : Int -> { model | player : Player.Player, monsters : Array Monster, actEvent : Array Event.ActEvent } -> { model | player : Player.Player, monsters : Array Monster, actEvent : Array Event.ActEvent }
updateOneMonster id model =
    model
        |> updateOneMonsterMode id
        |> updateOneMonsterMove id
        |> updateOneMonsterCollision id

updateOneMonsterMode : Int -> { model | player : Player.Player, monsters : Array Monster, actEvent : Array Event.ActEvent } -> { model | player : Player.Player, monsters : Array Monster, actEvent : Array Event.ActEvent }
updateOneMonsterMode id model =
    let
        monster =
            Array.get id model.monsters
                |> withDefault defMonster
        
        dx = (Tuple.first model.player.pos) - (Tuple.first monster.pos)

        newXMode =
            case monster.xMode of 
                Listen x ->
                    if dx < x && dx > (-x) then
                        Move
                    else
                        Listen
                Stop -> Stop
                Move -> Move
        
        newYMode =
            case monster.yMode of 
                Listen x ->
                    if dx < x && dx > (-x) then
                        Follow
                    else
                        Listen
                Stop -> Stop
                Follow -> Follow
        
        newMonster = { monster | xMode = newXMode, yMode = newYMode }

        newMonsters = Array.set id newMonster model.monsters

        newModel = { model | monsters = newMonsters }
    in
    newModel

