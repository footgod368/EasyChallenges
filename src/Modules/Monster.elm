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
    , range: ( Float, Float )
    , fixY : Float
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

type Direction
    = Left
    | Right

init : ( Float, Float ) -> MonsterAppearance -> MonsterXMode -> MonsterYMode ->  Float -> ( Float, Float) -> Monster
init ( x, y ) monsterAppearance monsterX monsterY xSpeed ( x1, x2 )=
    { pos = ( x, y )
    , collisionBox = monsterCollisionBox monsterAppearance
    , appearance = monsterAppearance
    , xMode = monsterX
    , yMode = monsterY
    , xSpeed = xSpeed
    , ySpeed = 0
    , range = ( x1, x2 )
    , fixY = y
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
defMonster = init ( 0, 0 ) ( MonsterA 20 20 ) Stop Stop 1 ( 0, 0 )

update : ( { model | player : Player.Player, monsters : Array Monster }, Cmd MainType.Msg ) -> ( { model | player : Player.Player, monsters : Array Monster }, Cmd MainType.Msg )
update ( model, cmd ) =
    ( List.foldl updateOneMonster model (List.range 0 (Array.length model.monsters - 1)), cmd )


{-| update one monster. Used in update. Not exposed.
-}
updateOneMonster : Int -> { model | player : Player.Player, monsters : Array Monster } -> { model | player : Player.Player, monsters : Array Monster }
updateOneMonster id model =
    model
        |> updateOneMonsterMode id
        |> updateOneMonsterMoveX id
        |> updateOneMonsterMoveY id
        |> updateOneMonsterCollision id

updateOneMonsterMode : Int -> { model | player : Player.Player, monsters : Array Monster } -> { model | player : Player.Player, monsters : Array Monster }
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
                Stop -> 
                    Stop
                Move -> 
                    Move
        
        newYMode =
            case monster.yMode of 
                Listen x ->
                    if dx < x && dx > (-x) then
                        Follow
                    else
                        Listen
                Stop -> 
                    Stop
                Follow -> 
                    Follow
        
        newMonster = { monster | xMode = newXMode, yMode = newYMode }

        newMonsters = Array.set id newMonster model.monsters

        newModel = { model | monsters = newMonsters }
    in
    newModel

updateOneMonsterMoveX : Int -> { model | player : Player.Player, monsters : Array Monster } -> { model | player : Player.Player, monsters : Array Monster }
updateOneMonsterMoveX id model =
    let
        monster =
            Array.get id model.monsters
                |> withDefault defMonster
        
        oldX = Tuple.first monster.pos

        newX = 
            case monster.xMode of
                Stop -> 
                    oldX
                Listen ->
                    oldX
                Move ->
                    oldX + monster.xSpeed
        
        newSpeed =
            if newX < Tuple.first monster.range && monster.xSpeed < 0 then
                -monster.xSpeed
            else if newX > Tuple.second monster.range && monster.xSpeed > 0 then
                -monster.xSpeed
            else
                monster.xSpeed
        
        newMonster = { monster | pos = ( newX, Tuple.second (monster.pos)), xSpeed = newSpeed }

        newMonsters = Array.set id newMonster model.monsters

        newModel = { model | monsters = newMonsters }                          
    in
    newModel


updateOneMonsterMoveY : Int -> { model | player : Player.Player, monsters : Array Monster } -> { model | player : Player.Player, monsters : Array Monster }
updateOneMonsterMoveY id model =
    let
        monster =
            Array.get id model.monsters
                |> withDefault defMonster
        
        oldY = Tuple.second monster.pos

        playerspeed = Tuple.second model.player.velocity

        newYSpeed =
            case monster.yMode of
                Stop ->
                    0
                Listen ->
                    0
                Follow ->
                    if playerspeed > 0 then
                        playerspeed
                    else
                        monster.ySpeed - 0.1
        
        newY = 
            if oldY + newYSpeed < monster.fixY then
                fixY
            else
                oldY + newYSpeed
        
        newnewYSpeed = 
            if oldY + newYSpeed < monster.fixY then
                0
            else
                newYSpeed

        newMonster = { monster | pos = ( Tuple.first monster.pos, newY), ySpeed = newnewYSpeed }   

        newMonsters = Array.set id newMonster model.monsters

        newModel = { model | monsters = newMonsters }                          
    in
    newModel

updateOneMonsterCollision : Int -> { model | player : Player.Player, monsters : Array Monster } -> { model | player : Player.Player, monsters : Array Monster }
updateOneMonsterCollision id model =
    let
        monster =
            Array.get id model.monsters
                |> withDefault defMonster 

        newModel =
            if Player.playerIfCollidePoly model monster == GlobalBasics.NotCollided then
                model
            else
                Player.playerDead model
    in
    newModel

{-| view one monster, used in view, not exposed.
-}
viewOneMonster : { model | windowBoundary : GlobalBasics.Pos, levelBoundary : GlobalBasics.Pos, player : Player.Player } -> Monster -> List (Svg MainType.Msg)
viewOneMonster model monster =
    let
        ( monsterX, monsterY ) =
            monster.pos
    in
    case monster.appearance of
        MonsterA width height ->
            [ Svg.rect
                [ SvgAttr.x (String.fromFloat (ViewMove.deltaX model + monsterX - 2.0))
                , SvgAttr.y (String.fromFloat (ViewMove.deltaY model + monsterY))
                , SvgAttr.strokeWidth "2"
                , SvgAttr.stroke "#00000000"
                , SvgAttr.fill "#FF0000FF"
                , SvgAttr.width (String.fromFloat (width + 2.0))
                , SvgAttr.height (String.fromFloat height)
                ]
                []
            ]

view : { model | monsters : Array Monster, windowBoundary : GlobalBasics.Pos, levelBoundary : GlobalBasics.Pos, player : Player.Player } -> List (Svg MainType.Msg)
view model =
    let
        monstersList =
            Array.toList model.monsters

        svgMonsterList =
            List.map (\monster -> viewOneMonster model monster) monstersList
    in
    List.concat svgMonsterList  