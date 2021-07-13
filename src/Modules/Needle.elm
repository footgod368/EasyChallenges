module Needle exposing
    ( NeedleVisibility(..), NeedleCollision(..), NeedleMove(..), NeedleAppearance(..), Needle
    , init, quickInit, defNeedleCollisionBox, normalNeedleHeight, normalNeedleWidth
    , view
    , update
    )

{-| The  unit. The most common unit in the game


# Needle

@docs NeedleVisibility, NeedleCollision, NeedleMove, NeedleAppearance, Needle


# Needle Constant

@docs needleWidth, needleHeight


# Init

@docs init, quickInit, defNeedle, defNeedleCollisionBox


# ViewMove

@docs view, viewOneNeedle


# Update

@docs update, updateOneNeedle, updateOneNeedleVisibility, updateOneNeedleCollision, updateOneNeedleMove

-}

import Array exposing (Array)
import Event
import GlobalBasics
import MainType
import Maybe exposing (withDefault)
import Player
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr
import ViewMove


{-| `NeedleVisibility` describes the visibility of the block. `Visible/Invisible (nextVisibility: NeedleVisibility)`:
nextVisibility means what will happen after this visibility. `NoNextNeedleVisibility` means no further visibility
change (Caution! Don't put it the first place). `VisibleAfterEvent/InvisibleAfterEvent (eventID: Int) (nextVisibility:
NeedleVisibility)`: eventId means in the last visibility, if eventID is activated, the `NeedleVisibility` will change
to this current `Visible/Invisible`. Don't put `Visible NeedleVisibility` or `Invisible NeedleVisibility` in the
following chain, this can only be put at the head. If you want it to be simply be visible, write:

    needleVisibility : NeedleVisibility
    needleVisibility =
        Visible NoNextNeedleVisibility

For complex things, for example, you want it to be invisible at first, then when `Event` whose id = 1 activates, it
become visible, then finally, when `Event` whose id = 2 activates, it becomes invisible, write:

    needleVisibility : NeedleVisibility
    needleVisibility =
        Invisible
            (VisibleAfterEvent 1
                (InvisibleAfterEvent 2 NoNextNeedleVisibility)
            )

This is designed delicately and may be quite hard to understand, ask YichenWei if you cannot understand.

-}
type NeedleVisibility
    = Visible NeedleVisibility
    | Invisible NeedleVisibility
    | VisibleAfterEvent Int NeedleVisibility
    | InvisibleAfterEvent Int NeedleVisibility
    | NoNextNeedleVisibility


{-| `NeedleCollision` describes if the collision of the block is considered. This is almost the same as
`NeedleVisibility`, see details in `NeedleVisibility`. Here is just a example. You want it to have no collision at
first, then when `Event` whose id = 1 activates, it has collision, then finally, when `Event` whose id = 2 activates,
it has no collision, write:

    blockCollision : NeedleCollision
    blockCollision =
        NoCollide
            (CollideAfterEvent 1
                (NoCollideAfterEvent 2 NoNextNeedleCollision)
            )

-}
type NeedleCollision
    = Collide NeedleCollision
    | NoCollide NeedleCollision
    | CollideAfterEvent Int NeedleCollision
    | NoCollideAfterEvent Int NeedleCollision
    | NoNextNeedleCollision


{-| `NeedleMove` describes whether and how the needle will move in the game. `Move (arrayPos : Array Pos) (speed :
Float) (nextMoveEventID : Int) (nextNeedleMove : NeedleMove)`: arrayPos means the way the block moves, speed is how fast
the block moves each frame, nextMoveEventID is when this stage of movement is finished, what movement happens next,
nextNeedleMove is next move, with None indicating no further movements take place. Note, if the first stage is no
movement, then it will move when `Event` whose id = 1 move, write like this, a null array will not make the block move:

    blockMove : NeedleMove
    blockMove =
        Move (Array.fromList [])
            0.0
            1
            (Move (Array.fromList [ ( 0.0, 100.0 ), ( 100.0, 100.0 ) ]) 10.0 -1 None)

-}
type NeedleMove
    = Move (Array GlobalBasics.Pos) Float Int NeedleMove
    | NoNextNeedleMove


{-| For future different shapes of blocks.
-}
type NeedleAppearance
    = NormalNeedle Float Float


{-| needleWidth Constant
-}
normalNeedleWidth : Float
normalNeedleWidth =
    Tuple.first GlobalBasics.blockSize


{-| needleHeight Constant
-}
normalNeedleHeight : Float
normalNeedleHeight =
    Tuple.second GlobalBasics.blockSize / 4.0


{-| `Needle` is a record of the block unit. See detail definitions in individual definition.
-}
type alias Needle =
    { pos : GlobalBasics.Pos
    , collisionBox : GlobalBasics.CollisionBox
    , appearance : NeedleAppearance
    , needleVisibility : NeedleVisibility
    , needleCollision : NeedleCollision
    , needleMove : NeedleMove
    }


{-| DefaultNeedle used with withDefault
-}
defNeedle : Needle
defNeedle =
    quickInit ( 0, 0 )


{-| initiate a needle, with full functions
-}
init : ( Float, Float ) -> GlobalBasics.CollisionBox -> NeedleAppearance -> NeedleVisibility -> NeedleCollision -> NeedleMove -> Needle
init ( x, y ) collisionBox needleAppearance needleVisibility needleCollision needleMove =
    { pos = ( x, y )
    , collisionBox = collisionBox
    , appearance = needleAppearance
    , needleVisibility = needleVisibility
    , needleCollision = needleCollision
    , needleMove = needleMove
    }


{-| default appearance, always visible, have collision, don't move
-}
quickInit : ( Float, Float ) -> Needle
quickInit ( x, y ) =
    { pos = ( x, y )
    , collisionBox = defNeedleCollisionBox
    , appearance = NormalNeedle normalNeedleWidth normalNeedleHeight
    , needleVisibility = Visible NoNextNeedleVisibility
    , needleCollision = Collide NoNextNeedleCollision
    , needleMove = NoNextNeedleMove
    }


{-| default collisionBox
-}
defNeedleCollisionBox : GlobalBasics.CollisionBox
defNeedleCollisionBox =
    GlobalBasics.Polygon
        (Array.fromList
            [ ( ( 0.0, 0.0 ), ( normalNeedleWidth, 0.0 ) )
            , ( ( normalNeedleWidth, 0.0 ), ( normalNeedleWidth, normalNeedleHeight ) )
            , ( ( normalNeedleWidth, normalNeedleHeight ), ( 0.0, normalNeedleHeight ) )
            , ( ( 0.0, normalNeedleHeight ), ( 0.0, 0.0 ) )
            ]
        )


{-| view one needle, used in view, not exposed.
-}
viewOneNeedle : { model | windowBoundary : GlobalBasics.Pos, levelBoundary : GlobalBasics.Pos, player : Player.Player } -> Needle -> List (Svg MainType.Msg)
viewOneNeedle model needle =
    case needle.needleVisibility of
        Visible _ ->
            let
                ( needleX, needleY ) =
                    needle.pos
            in
            [ Svg.rect
                [ SvgAttr.x (String.fromFloat (ViewMove.deltaX model + needleX - 2.0))
                , SvgAttr.y (String.fromFloat (ViewMove.deltaY model + needleY))
                , SvgAttr.width (String.fromFloat (normalNeedleWidth + 2.0))
                , SvgAttr.height (String.fromFloat normalNeedleHeight)
                , SvgAttr.strokeWidth "2"
                , SvgAttr.stroke "#00000000"
                , SvgAttr.fill "#FF0000FF"
                ]
                []
            ]

        Invisible _ ->
            []

        _ ->
            []


{-| view function of needle
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


{-| update function of needle unit
-}
update : ( { model | player : Player.Player, needles : Array Needle, actEvent : Array Event.ActEvent }, Cmd MainType.Msg ) -> ( { model | player : Player.Player, needles : Array Needle, actEvent : Array Event.ActEvent }, Cmd MainType.Msg )
update ( model, cmd ) =
    ( List.foldl updateOneNeedle model (List.range 0 (Array.length model.needles - 1)), cmd )


{-| update one needle. Used in update. Not exposed.
-}
updateOneNeedle : Int -> { model | player : Player.Player, needles : Array Needle, actEvent : Array Event.ActEvent } -> { model | player : Player.Player, needles : Array Needle, actEvent : Array Event.ActEvent }
updateOneNeedle id model =
    model
        |> updateOneNeedleVisibility id
        |> updateOneNeedleCollision id
        |> updateOneNeedleMove id


{-| update needle visibility. Used in update. Not exposed.
-}
updateOneNeedleVisibility : Int -> { model | player : Player.Player, needles : Array Needle, actEvent : Array Event.ActEvent } -> { model | player : Player.Player, needles : Array Needle, actEvent : Array Event.ActEvent }
updateOneNeedleVisibility id model =
    let
        needle =
            Array.get id model.needles
                |> withDefault defNeedle

        nextVisibility =
            case needle.needleVisibility of
                Visible tempNextVisibility ->
                    tempNextVisibility

                Invisible tempNextVisibility ->
                    tempNextVisibility

                _ ->
                    NoNextNeedleVisibility

        newNeedleVisibility =
            case nextVisibility of
                VisibleAfterEvent eventID nextNextVisibility ->
                    if Event.ifActEventById model eventID == Event.ActEventAct then
                        Visible nextNextVisibility

                    else
                        needle.needleVisibility

                InvisibleAfterEvent eventID nextNextVisibility ->
                    if Event.ifActEventById model eventID == Event.ActEventAct then
                        Invisible nextNextVisibility

                    else
                        needle.needleVisibility

                _ ->
                    needle.needleVisibility

        newNeedle =
            { needle | needleVisibility = newNeedleVisibility }

        newNeedles =
            Array.set id newNeedle model.needles

        newModel =
            { model | needles = newNeedles }
    in
    newModel


{-| update needle collision. Used in update. Not exposed.
-}
updateOneNeedleCollision : Int -> { model | player : Player.Player, needles : Array Needle, actEvent : Array Event.ActEvent } -> { model | player : Player.Player, needles : Array Needle, actEvent : Array Event.ActEvent }
updateOneNeedleCollision id model =
    let
        needle =
            Array.get id model.needles
                |> withDefault defNeedle

        nextCollision =
            case needle.needleCollision of
                Collide tempNextCollision ->
                    tempNextCollision

                NoCollide tempNextCollision ->
                    tempNextCollision

                _ ->
                    NoNextNeedleCollision

        newNeedleCollision =
            case nextCollision of
                CollideAfterEvent eventID nextNextCollision ->
                    if Event.ifActEventById model eventID == Event.ActEventAct then
                        Collide nextNextCollision

                    else
                        needle.needleCollision

                NoCollideAfterEvent eventID nextNextCollision ->
                    if Event.ifActEventById model eventID == Event.ActEventAct then
                        NoCollide nextNextCollision

                    else
                        needle.needleCollision

                _ ->
                    needle.needleCollision

        newNeedle =
            { needle | needleCollision = newNeedleCollision }

        newNeedles =
            Array.set id newNeedle model.needles

        newNeedlesModel =
            { model | needles = newNeedles }

        newPlayerModel =
            case newNeedleCollision of
                Collide tempNextCollision ->
                    if Player.playerIfCollidePoly newNeedlesModel needle == GlobalBasics.NotCollided then
                        newNeedlesModel

                    else
                        Player.playerDead newNeedlesModel
                _ ->
                    newNeedlesModel
    in
    newPlayerModel


{-| update needle move event. Used in `updateOneNeedle`. Not exposed
-}
updateOneNeedleMove : Int -> { model | player : Player.Player, needles : Array Needle, actEvent : Array Event.ActEvent } -> { model | player : Player.Player, needles : Array Needle, actEvent : Array Event.ActEvent }
updateOneNeedleMove id model =
    let
        needle =
            Array.get id model.needles
                |> withDefault defNeedle
    in
    case needle.needleMove of
        Move posArray speed eventID nextMove ->
            if Array.isEmpty posArray then
                if Event.ifActEventById model eventID == Event.ActEventAct then
                    let
                        newNeedle =
                            { needle | needleMove = nextMove }

                        newNeedles =
                            Array.set id newNeedle model.needles
                    in
                    { model | needles = newNeedles }

                else
                    model

            else
                let
                    destination =
                        withDefault GlobalBasics.defPos (Array.get 0 posArray)
                in
                if GlobalBasics.distPosPos destination needle.pos <= speed then
                    let
                        newPosArray =
                            Array.slice 1 (Array.length posArray) posArray

                        newNeedle =
                            { needle | pos = destination, needleMove = Move newPosArray speed eventID nextMove }

                        newNeedles =
                            Array.set id newNeedle model.needles
                    in
                    { model | needles = newNeedles }

                else
                    let
                        ( destinationX, destinationY ) =
                            destination

                        ( posX, posY ) =
                            needle.pos

                        newPos =
                            if posX == destinationX then
                                if destinationY > posY then
                                    ( posX, posY + speed )

                                else
                                    ( posX, posY - speed )

                            else
                                let
                                    degree =
                                        atan ((destinationY - posY) / (destinationX - posX))

                                    deltaX =
                                        if destinationX > posX then
                                            abs (speed * cos degree)

                                        else
                                            -(abs (speed * cos degree))

                                    deltaY =
                                        if destinationY > posY then
                                            abs (speed * sin degree)

                                        else
                                            -(abs (speed * sin degree))
                                in
                                ( posX + deltaX, posY + deltaY )

                        newNeedle =
                            { needle | pos = newPos }

                        newNeedles =
                            Array.set id newNeedle model.needles
                    in
                    { model | needles = newNeedles }

        NoNextNeedleMove ->
            model
