module Modules.Monster exposing
    ( Monster, MonsterAppearance(..), MonsterXMode(..), MonsterYMode(..)
    , init, monsterCollisionBox
    , update
    , view
    )

{-| The monster. A special unit in some levels.


# Monster

@docs Monster, MonsterAppearance, MonsterXMode, MonsterYMode


# Init

@docs init, monsterCollisionBox


# Update

@docs update


# View

@docs view

-}

import Array exposing (Array)
import GlobalFunction.GlobalBasics as GlobalBasics
import MainFunction.MainType as MainType
import Maybe exposing (withDefault)
import Modules.Event as Event
import Modules.Player as Player
import Modules.ViewMove as ViewMove
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr


{-| Monster is a record for a special unit.
xSpeed is the speed that monster moves along x direction, can be decided in init function.
ySpeed is the speed along y direction, it's initial value is 0, it will only works in Follow mode.
range is two values that describes the horizontal range for a monster to move back and forward continuously.
It can be decided in init function.
fixY is a mark of the monster's initial y position, describes the "ground" for monster's jumping.
It will automatically reads from initial pos
-}
type alias Monster =
    { pos : GlobalBasics.Pos
    , collisionBox : GlobalBasics.CollisionBox
    , appearance : MonsterAppearance
    , xMode : MonsterXMode
    , yMode : MonsterYMode
    , xSpeed : Float
    , ySpeed : Float
    , range : ( Float, Float )
    , fixY : Float
    }


{-| MonsterAppearance currently describes the size of the monster, maybe different styles will be implemented later.
-}
type MonsterAppearance
    = MonsterA Float Float


{-| MonsterXMode describes the monster's moving mode in x direction.
StopX means it doesn't move in x direction.
ListenX means it stops first, when player is close to the monster, it changes to Move mode.
The Float after it describes the horizontal distance between player and monster needed to "activate" the monster.
Move means it move along the x direction with certain speed and range.
-}
type MonsterXMode
    = StopX
    | ListenX Float
    | Move


{-| MonsterYMode describes the monster's moving in y direction.
StopY means it doesn't move in y direction.
ListenY is similar to the mode "ListenX". Noting that the Float still represents the horizontal distance.
Follow means that it will jump when player jumps, but the monster's y position is always larger or equal than its initial y position.
-}
type MonsterYMode
    = StopY
    | ListenY Float
    | Follow


{-| Initiate a monster
-}
init : ( Float, Float ) -> MonsterAppearance -> MonsterXMode -> MonsterYMode -> Float -> ( Float, Float ) -> Monster
init ( x, y ) monsterAppearance monsterX monsterY xSpeed ( x1, x2 ) =
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


{-| default monster
-}
defMonster : Monster
defMonster =
    init ( 0, 0 ) (MonsterA 20 20) StopX StopY 1 ( 0, 0 )


{-| update function of monster
-}
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


{-| update one monster's mode, not exposed.
-}
updateOneMonsterMode : Int -> { model | player : Player.Player, monsters : Array Monster } -> { model | player : Player.Player, monsters : Array Monster }
updateOneMonsterMode id model =
    let
        monster =
            Array.get id model.monsters
                |> withDefault defMonster

        dx =
            Tuple.first model.player.pos - Tuple.first monster.pos

        newXMode =
            case monster.xMode of
                ListenX x ->
                    if dx < x && dx > -x then
                        Move

                    else
                        ListenX x

                StopX ->
                    StopX

                Move ->
                    Move

        newYMode =
            case monster.yMode of
                ListenY x ->
                    if dx < x && dx > -x then
                        Follow

                    else
                        ListenY x

                StopY ->
                    StopY

                Follow ->
                    Follow

        newMonster =
            { monster | xMode = newXMode, yMode = newYMode }

        newMonsters =
            Array.set id newMonster model.monsters

        newModel =
            { model | monsters = newMonsters }
    in
    newModel


{-| update one monster's move in x direction, not exposed
-}
updateOneMonsterMoveX : Int -> { model | player : Player.Player, monsters : Array Monster } -> { model | player : Player.Player, monsters : Array Monster }
updateOneMonsterMoveX id model =
    let
        monster =
            Array.get id model.monsters
                |> withDefault defMonster

        oldX =
            Tuple.first monster.pos

        newX =
            case monster.xMode of
                StopX ->
                    oldX

                ListenX _ ->
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

        newMonster =
            { monster | pos = ( newX, Tuple.second monster.pos ), xSpeed = newSpeed }

        newMonsters =
            Array.set id newMonster model.monsters

        newModel =
            { model | monsters = newMonsters }
    in
    newModel


{-| update one monster's move in y direction, not exposed
-}
updateOneMonsterMoveY : Int -> { model | player : Player.Player, monsters : Array Monster } -> { model | player : Player.Player, monsters : Array Monster }
updateOneMonsterMoveY id model =
    let
        monster =
            Array.get id model.monsters
                |> withDefault defMonster

        oldY =
            Tuple.second monster.pos

        playerspeed =
            Tuple.second model.player.velocity

        newYSpeed =
            case monster.yMode of
                StopY ->
                    0

                ListenY _ ->
                    0

                Follow ->
                    if playerspeed < 0 then
                        playerspeed

                    else
                        monster.ySpeed + 0.1

        newY =
            if oldY + newYSpeed > monster.fixY then
                monster.fixY

            else
                oldY + newYSpeed

        newnewYSpeed =
            if oldY + newYSpeed > monster.fixY then
                0

            else
                newYSpeed

        newMonster =
            { monster | pos = ( Tuple.first monster.pos, newY ), ySpeed = newnewYSpeed }

        newMonsters =
            Array.set id newMonster model.monsters

        newModel =
            { model | monsters = newMonsters }
    in
    newModel


{-| update one monster's collision, not exposed
-}
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


{-| view function of monster
-}
view : { model | monsters : Array Monster, windowBoundary : GlobalBasics.Pos, levelBoundary : GlobalBasics.Pos, player : Player.Player } -> List (Svg MainType.Msg)
view model =
    let
        monstersList =
            Array.toList model.monsters

        svgMonsterList =
            List.map (\monster -> viewOneMonster model monster) monstersList
    in
    List.concat svgMonsterList
